<?php
declare(strict_types=1);

require_once __DIR__ . '/lead-config.php';
require_once __DIR__ . '/form-security.php';

function vf_security_subject_prefix(array $report): string
{
    $score = (int) ($report['score'] ?? 0);
    return match ((string) ($report['level'] ?? 'low')) {
        'high' => '[ВОЗМОЖНЫЙ СПАМ ' . $score . '/100] ',
        'review' => '[ПРОВЕРИТЬ ' . $score . '/100] ',
        default => '[РИСК ' . $score . '/100] ',
    };
}

function vf_append_security_report(array $message, array $report): array
{
    $result = [
        '=== АВТОМАТИЧЕСКАЯ ПРОВЕРКА ===',
        'Статус: ' . (string) ($report['status'] ?? 'Оценка недоступна'),
        'Оценка риска: ' . (int) ($report['score'] ?? 0) . '/100',
        'Режим: наблюдение — заявка не блокируется автоматически по набранным баллам',
    ];
    $signals = is_array($report['signals'] ?? null) ? $report['signals'] : [];
    if ($signals === []) {
        $result[] = 'Подозрительные признаки: не обнаружены';
    } else {
        $result[] = 'Причины начисления баллов:';
        foreach ($signals as $signal) {
            $result[] = '[+' . (int) ($signal['points'] ?? 0) . '] ' . (string) ($signal['reason'] ?? 'Неизвестный сигнал');
        }
    }
    if (is_int($report['form_age_seconds'] ?? null)) {
        $result[] = 'Время заполнения после получения маркера: ' . (int) $report['form_age_seconds'] . ' сек.';
    }
    $result[] = 'Сопоставление с историей: ' . (!empty($report['history_available']) ? 'выполнено' : 'временно недоступно');
    $result[] = '';
    $result[] = '=== ДАННЫЕ ЗАЯВКИ ===';
    return array_merge($result, $message);
}

function vf_append_request_context(array $message): array
{
    $tracking = [
        'utm_source' => 'UTM source',
        'utm_medium' => 'UTM medium',
        'utm_campaign' => 'UTM campaign',
        'utm_content' => 'UTM content',
        'utm_term' => 'UTM term',
        'yclid' => 'YCLID',
        'gclid' => 'GCLID',
        'ym_client_id' => 'Yandex Metrica ClientID',
    ];
    $message[] = '';
    $message[] = '=== ИСТОЧНИК И ТЕХНИЧЕСКИЕ ДАННЫЕ ===';
    $message[] = 'Время (Москва): ' . date('d.m.Y H:i:s');
    $message[] = 'Страница отправки: ' . (vf_form_value('source_url', 700) ?: '—');
    $message[] = 'Источник перехода: ' . (vf_form_value('referrer', 700) ?: 'прямой переход / не передан');
    foreach ($tracking as $field => $label) {
        $value = vf_form_value($field, 300);
        if ($value !== '') {
            $message[] = $label . ': ' . $value;
        }
    }
    $message[] = 'IP: ' . (vf_server_value('REMOTE_ADDR', 80) ?: '—');
    $message[] = 'Браузер: ' . (vf_server_value('HTTP_USER_AGENT') ?: '—');
    $message[] = 'Язык браузера: ' . (vf_server_value('HTTP_ACCEPT_LANGUAGE', 300) ?: '—');
    try {
        $requestId = bin2hex(random_bytes(8));
    } catch (Throwable $exception) {
        $requestId = uniqid('lead-', true);
    }
    $message[] = 'ID заявки: ' . $requestId;
    return $message;
}

function vf_send_notification(string $subject, array $message, string $contact, array $securityReport): bool
{
    if (getenv('VF_MAIL_DRY_RUN') === '1') {
        return true;
    }

    $replyTo = filter_var($contact, FILTER_VALIDATE_EMAIL) !== false
        ? str_replace(["\r", "\n"], '', $contact)
        : VF_NOTIFICATION_RECIPIENT;
    $encodedSubject = '=?UTF-8?B?' . base64_encode(vf_security_subject_prefix($securityReport) . '[Валерия Фридлендер] ' . $subject) . '?=';
    $encodedFromName = '=?UTF-8?B?' . base64_encode('Сайт Валерии Фридлендер') . '?=';
    $headers = [
        'From: ' . $encodedFromName . ' <' . VF_FROM_ADDRESS . '>',
        'Reply-To: ' . $replyTo,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Auto-Response-Suppress: All',
        'X-Entity-Ref-ID: ' . hash('sha256', implode('|', $message) . microtime(true)),
    ];
    $body = implode("\r\n", vf_append_request_context(vf_append_security_report($message, $securityReport)));
    $sent = mail(VF_NOTIFICATION_RECIPIENT, $encodedSubject, $body, implode("\r\n", $headers), '-f' . VF_FROM_ADDRESS);
    if (!$sent) {
        error_log('Valerya lead notification delivery failed');
    }
    return $sent;
}
