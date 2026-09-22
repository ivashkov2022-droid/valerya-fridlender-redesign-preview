<?php
declare(strict_types=1);

require_once __DIR__ . '/lead-config.php';

const VF_FORM_TOKEN_LIFETIME = 86400;
const VF_FORM_HISTORY_LIFETIME = 2592000;
const VF_FORM_HISTORY_MAX_BYTES = 4194304;
const VF_MAX_POST_BYTES = 32768;

function vf_form_value(string $key, int $maxLength = 1000): string
{
    $rawValue = $_POST[$key] ?? '';
    if (!is_scalar($rawValue)) {
        return '';
    }
    $value = trim(str_replace(["\0", "\r"], ['', ''], (string) $rawValue));
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }
    return substr($value, 0, $maxLength);
}

function vf_server_value(string $key, int $maxLength = 1000): string
{
    $value = trim(str_replace(["\0", "\r", "\n"], ['', ' ', ' '], (string) ($_SERVER[$key] ?? '')));
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }
    return substr($value, 0, $maxLength);
}

function vf_reject_oversized_submission(): void
{
    $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > VF_MAX_POST_BYTES) {
        http_response_code(413);
        exit('Payload Too Large');
    }
}

function vf_private_directory(): string
{
    static $resolved = null;
    if (is_string($resolved)) {
        return $resolved;
    }

    $configured = trim((string) getenv('VF_FORM_PRIVATE_DIR'));
    $documentRoot = rtrim((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''), "\\/");
    $candidates = array_filter([
        $configured,
        $documentRoot !== '' ? dirname($documentRoot) . DIRECTORY_SEPARATOR . 'shared' . DIRECTORY_SEPARATOR . 'valerya-forms' : '',
        rtrim(sys_get_temp_dir(), "\\/") . DIRECTORY_SEPARATOR . 'valerya-forms',
    ]);

    foreach ($candidates as $candidate) {
        if ((is_dir($candidate) || @mkdir($candidate, 0700, true)) && is_writable($candidate)) {
            @chmod($candidate, 0700);
            $resolved = $candidate;
            return $resolved;
        }
    }

    throw new RuntimeException('Private form directory is not writable');
}

function vf_security_secret(): string
{
    static $secret = null;
    if (is_string($secret) && $secret !== '') {
        return $secret;
    }

    $fromEnvironment = trim((string) getenv('VF_FORM_SECRET'));
    if (strlen($fromEnvironment) >= 32) {
        $secret = $fromEnvironment;
        return $secret;
    }

    $path = vf_private_directory() . DIRECTORY_SEPARATOR . 'form-secret.key';
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        throw new RuntimeException('Cannot open form secret');
    }
    $stored = trim((string) stream_get_contents($handle));
    if (strlen($stored) < 32) {
        $stored = bin2hex(random_bytes(32));
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, $stored);
        fflush($handle);
    }
    flock($handle, LOCK_UN);
    fclose($handle);
    @chmod($path, 0600);
    $secret = $stored;
    return $secret;
}

function vf_base64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function vf_base64url_decode(string $value): string|false
{
    $padding = strlen($value) % 4;
    if ($padding > 0) {
        $value .= str_repeat('=', 4 - $padding);
    }
    return base64_decode(strtr($value, '-_', '+/'), true);
}

function vf_issue_form_token(string $formKey): string
{
    if (!vf_form_key_is_valid($formKey)) {
        return '';
    }
    $payload = json_encode([
        'form' => $formKey,
        'issued_at' => time(),
        'nonce' => bin2hex(random_bytes(12)),
    ], JSON_UNESCAPED_SLASHES);
    if (!is_string($payload)) {
        return '';
    }
    $encoded = vf_base64url_encode($payload);
    $signature = hash_hmac('sha256', $encoded, vf_security_secret());
    return $encoded . '.' . $signature;
}

function vf_inspect_form_token(string $token, string $expectedForm): array
{
    $invalid = static fn(string $reason): array => ['valid' => false, 'reason' => $reason, 'age_seconds' => null, 'nonce_hash' => ''];
    if ($token === '') {
        return $invalid('Серверный маркер формы отсутствует');
    }
    $parts = explode('.', $token, 2);
    if (count($parts) !== 2 || !hash_equals(hash_hmac('sha256', $parts[0], vf_security_secret()), $parts[1])) {
        return $invalid('Подпись серверного маркера формы недействительна');
    }
    $decoded = vf_base64url_decode($parts[0]);
    $payload = is_string($decoded) ? json_decode($decoded, true) : null;
    if (!is_array($payload) || ($payload['form'] ?? '') !== $expectedForm) {
        return $invalid('Маркер выпущен для другой формы');
    }
    $issuedAt = (int) ($payload['issued_at'] ?? 0);
    $nonce = (string) ($payload['nonce'] ?? '');
    $age = time() - $issuedAt;
    if ($issuedAt <= 0 || $age < -60 || $age > VF_FORM_TOKEN_LIFETIME || $nonce === '') {
        return $invalid('Срок действия серверного маркера истёк');
    }
    return [
        'valid' => true,
        'reason' => '',
        'age_seconds' => max(0, $age),
        'nonce_hash' => vf_security_hash($nonce),
    ];
}

function vf_security_hash(string $value): string
{
    if ($value === '') {
        return '';
    }
    return hash_hmac('sha256', $value, vf_security_secret());
}

function vf_lower(string $value): string
{
    return function_exists('mb_strtolower') ? mb_strtolower($value, 'UTF-8') : strtolower($value);
}

function vf_add_signal(array &$signals, int $points, string $reason): void
{
    $signals[] = ['points' => $points, 'reason' => $reason];
}

function vf_history_read_and_append(array $record): array
{
    try {
        $path = vf_private_directory() . DIRECTORY_SEPARATOR . 'submission-history.jsonl';
        $handle = @fopen($path, 'c+');
        if ($handle === false || !flock($handle, LOCK_EX)) {
            return ['available' => false, 'records' => []];
        }
        rewind($handle);
        $contents = stream_get_contents($handle);
        $records = [];
        $cutoff = time() - VF_FORM_HISTORY_LIFETIME;
        if (is_string($contents) && $contents !== '') {
            foreach (preg_split('/\R/', $contents) ?: [] as $line) {
                $entry = $line !== '' ? json_decode($line, true) : null;
                if (is_array($entry) && (int) ($entry['time'] ?? 0) >= $cutoff) {
                    $records[] = $entry;
                }
            }
        }
        $previous = $records;
        $records[] = $record;
        $lines = [];
        foreach ($records as $entry) {
            $encoded = json_encode($entry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            if (is_string($encoded)) {
                $lines[] = $encoded;
            }
        }
        $newContents = implode("\n", $lines) . "\n";
        if (strlen($newContents) > VF_FORM_HISTORY_MAX_BYTES) {
            $lines = array_slice($lines, -5000);
            $newContents = implode("\n", $lines) . "\n";
        }
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, $newContents);
        fflush($handle);
        flock($handle, LOCK_UN);
        fclose($handle);
        @chmod($path, 0600);
        return ['available' => true, 'records' => $previous];
    } catch (Throwable $exception) {
        error_log('Valerya form history unavailable: ' . $exception->getMessage());
        return ['available' => false, 'records' => []];
    }
}

function vf_analyze_submission(string $formKey, array $submission): array
{
    $signals = [];
    $now = time();
    $name = trim((string) ($submission['name'] ?? ''));
    $contact = vf_lower(trim((string) ($submission['contact'] ?? '')));
    $message = vf_lower(trim((string) ($submission['message'] ?? '')));
    $honeypot = trim((string) ($submission['honeypot'] ?? ''));
    $tokenInspection = vf_inspect_form_token(trim((string) ($submission['form_token'] ?? '')), $formKey);
    $remoteAddress = vf_server_value('REMOTE_ADDR', 80);
    $userAgent = vf_server_value('HTTP_USER_AGENT');
    $acceptLanguage = vf_server_value('HTTP_ACCEPT_LANGUAGE', 300);
    $origin = vf_server_value('HTTP_ORIGIN', 700);
    $referer = vf_server_value('HTTP_REFERER', 700);

    if ($honeypot !== '') {
        vf_add_signal($signals, 100, 'Заполнено скрытое поле honeypot');
    }
    if (!$tokenInspection['valid']) {
        vf_add_signal($signals, vf_form_value('form_token', 1600) === '' ? 20 : 45, $tokenInspection['reason']);
    } else {
        $age = (int) $tokenInspection['age_seconds'];
        if ($age < 2) {
            vf_add_signal($signals, 55, 'Форма отправлена менее чем за 2 секунды');
        } elseif ($age < 5) {
            vf_add_signal($signals, 30, 'Форма отправлена быстрее чем за 5 секунд');
        } elseif ($age < 8) {
            vf_add_signal($signals, 15, 'Форма отправлена быстрее чем за 8 секунд');
        }
    }
    if ($userAgent === '') {
        vf_add_signal($signals, 20, 'Не передан User-Agent');
    } elseif (preg_match('/curl|wget|python|requests|httpclient|headless|selenium|playwright|phantomjs/i', $userAgent) === 1) {
        vf_add_signal($signals, 45, 'User-Agent похож на автоматический инструмент');
    }
    if ($acceptLanguage === '') {
        vf_add_signal($signals, 10, 'Не переданы языковые настройки браузера');
    }
    if ($origin === '' && $referer === '') {
        vf_add_signal($signals, 10, 'Не переданы Origin и Referer');
    }
    if (preg_match('/https?:\/\/|www\./iu', $name) === 1 || preg_match_all('/\d/u', $name) > 4) {
        vf_add_signal($signals, 25, 'Имя содержит ссылку или необычно много цифр');
    }
    $contactDigits = preg_replace('/\D+/', '', $contact) ?? '';
    if ($contactDigits !== '' && preg_match('/^(\d)\1{6,}$/', $contactDigits) === 1) {
        vf_add_signal($signals, 30, 'Контакт состоит из повторяющейся цифры');
    }
    if (preg_match_all('/https?:\/\//iu', $message) >= 2) {
        vf_add_signal($signals, 30, 'В сообщении несколько ссылок');
    }

    $contactHash = vf_security_hash($contact);
    $ipHash = vf_security_hash($remoteAddress);
    $payloadHash = vf_security_hash(vf_lower($name) . '|' . $contact . '|' . $message . '|' . $formKey);
    $nonceHash = (string) ($tokenInspection['nonce_hash'] ?? '');
    $history = vf_history_read_and_append([
        'time' => $now,
        'form' => $formKey,
        'contact_hash' => $contactHash,
        'ip_hash' => $ipHash,
        'payload_hash' => $payloadHash,
        'nonce_hash' => $nonceHash,
        'token_valid' => (bool) $tokenInspection['valid'],
        'form_age_seconds' => $tokenInspection['valid'] ? (int) $tokenInspection['age_seconds'] : null,
        'honeypot_filled' => $honeypot !== '',
        'source_url' => vf_form_value('source_url', 700),
        'utm_source' => vf_form_value('utm_source', 160),
        'utm_campaign' => vf_form_value('utm_campaign', 160),
    ]);

    $contactCount24Hours = 0;
    $ipCount10Minutes = 0;
    $duplicatePayload = false;
    $replayedToken = false;
    foreach ($history['records'] as $record) {
        $recordTime = (int) ($record['time'] ?? 0);
        if ($contactHash !== '' && ($record['contact_hash'] ?? '') === $contactHash && $recordTime >= $now - 86400) {
            $contactCount24Hours++;
        }
        if ($ipHash !== '' && ($record['ip_hash'] ?? '') === $ipHash && $recordTime >= $now - 600) {
            $ipCount10Minutes++;
        }
        if ($payloadHash !== '' && ($record['payload_hash'] ?? '') === $payloadHash && $recordTime >= $now - 86400) {
            $duplicatePayload = true;
        }
        if ($nonceHash !== '' && ($record['nonce_hash'] ?? '') === $nonceHash) {
            $replayedToken = true;
        }
    }
    if ($contactCount24Hours >= 2) {
        vf_add_signal($signals, 20, 'С этого контакта уже поступало несколько заявок за 24 часа');
    }
    if ($ipCount10Minutes >= 6) {
        vf_add_signal($signals, 50, 'С этого IP поступило не менее 6 заявок за 10 минут');
    } elseif ($ipCount10Minutes >= 3) {
        vf_add_signal($signals, 25, 'С этого IP поступило не менее 3 заявок за 10 минут');
    }
    if ($duplicatePayload) {
        vf_add_signal($signals, 40, 'Полностью совпадающая заявка уже поступала за 24 часа');
    }
    if ($replayedToken) {
        vf_add_signal($signals, 50, 'Повторно использован маркер формы');
    }

    $score = 0;
    foreach ($signals as $signal) {
        $score += (int) $signal['points'];
    }
    $score = min(100, max(0, $score));
    if ($score >= 60) {
        $level = 'high';
        $status = 'ВЫСОКИЙ РИСК — возможный бот или спам';
    } elseif ($score >= 30) {
        $level = 'review';
        $status = 'ТРЕБУЕТ ПРОВЕРКИ';
    } else {
        $level = 'low';
        $status = 'НИЗКИЙ РИСК — похоже на обычную заявку';
    }

    return [
        'score' => $score,
        'level' => $level,
        'status' => $status,
        'signals' => $signals,
        'form_age_seconds' => $tokenInspection['valid'] ? (int) $tokenInspection['age_seconds'] : null,
        'history_available' => (bool) $history['available'],
        'blocked' => $honeypot !== '',
    ];
}
