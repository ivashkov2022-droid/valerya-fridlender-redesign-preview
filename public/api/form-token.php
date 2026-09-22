<?php
declare(strict_types=1);

require_once __DIR__ . '/form-security.php';

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('X-Robots-Tag: noindex, nofollow, noarchive');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$formKey = trim((string) ($_GET['form'] ?? ''));
if (!vf_form_key_is_valid($formKey)) {
    http_response_code(400);
    echo json_encode(['error' => 'Unknown form']);
    exit;
}

try {
    echo json_encode(['token' => vf_issue_form_token($formKey)], JSON_UNESCAPED_SLASHES);
} catch (Throwable $exception) {
    error_log('Valerya token issue failed: ' . $exception->getMessage());
    http_response_code(503);
    echo json_encode(['error' => 'Token temporarily unavailable']);
}
