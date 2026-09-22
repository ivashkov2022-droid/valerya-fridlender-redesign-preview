<?php
declare(strict_types=1);

require_once __DIR__ . '/form-session.php';
require_once __DIR__ . '/form-security.php';
require_once __DIR__ . '/mail-delivery.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Method Not Allowed');
}

vf_reject_cross_site_submission();
vf_reject_oversized_submission();

function vf_redirect(string $location): void
{
    header('Location: ' . $location, true, 303);
    exit;
}

$formKey = vf_form_value('form_key', 80);
$definition = vf_form_definition($formKey);
$name = vf_form_value('name', 80);
$contact = vf_form_value('contact', 160);
$messageText = vf_form_value('message', 1600);
$consent = vf_form_value('consent', 10);
$honeypot = vf_form_value('website', 200);
$formToken = vf_form_value('form_token', 1600);
$contactLength = function_exists('mb_strlen') ? mb_strlen($contact, 'UTF-8') : strlen($contact);

if ($definition === null || $name === '' || $contactLength < 4 || $consent !== 'yes') {
    vf_redirect('../?form=error#contact');
}

$securityReport = vf_analyze_submission($formKey, [
    'name' => $name,
    'contact' => $contact,
    'message' => $messageText,
    'honeypot' => $honeypot,
    'form_token' => $formToken,
]);

if (!empty($securityReport['blocked'])) {
    vf_redirect('../?form=received#contact');
}

$message = [
    'Новая заявка с сайта Валерии Фридлендер',
    '',
    'Форма: ' . (string) $definition['label'],
    'Ключ конверсии: ' . $formKey,
    'Имя: ' . $name,
    'Контакт: ' . $contact,
    'Сообщение: ' . ($messageText !== '' ? $messageText : 'не указано'),
    'Согласие на обработку персональных данных: получено',
];

if (!vf_send_notification('Новая заявка — ' . (string) $definition['label'], $message, $contact, $securityReport)) {
    vf_redirect('../?form=send-error#contact');
}

vf_grant_thank_you_access($formKey);
vf_redirect('../thanks/' . (string) $definition['slug'] . '.php');
