<?php
declare(strict_types=1);

const VF_NOTIFICATION_RECIPIENT = 'ivv2@mail.ru';
const VF_FROM_ADDRESS = 'noreply@vazuri.ru';

function vf_form_definitions(): array
{
    return [
        'header-start' => ['label' => 'Шапка — начать работу', 'slug' => 'start', 'title' => 'Спасибо. Заявка отправлена.', 'text' => 'Валерия прочитает сообщение лично и свяжется с вами по указанному контакту.'],
        'hero-consultation' => ['label' => 'Первый экран — консультация', 'slug' => 'consultation', 'title' => 'Спасибо за обращение.', 'text' => 'Валерия ответит лично и предложит доступное время для первой консультации.'],
        'discuss-request' => ['label' => 'Обсудить запрос', 'slug' => 'discuss-request', 'title' => 'Запрос отправлен.', 'text' => 'Формулировка не обязана быть окончательной — её можно будет уточнить вместе.'],
        'individual-therapy' => ['label' => 'Индивидуальная терапия', 'slug' => 'individual-therapy', 'title' => 'Спасибо. Сообщение у Валерии.', 'text' => 'Валерия ознакомится с вашей ситуацией и предложит следующий шаг.'],
        'trauma-experience' => ['label' => 'Травматический опыт', 'slug' => 'trauma-experience', 'title' => 'Спасибо за доверие.', 'text' => 'Подробно описывать пережитое не требуется. Валерия ответит бережно и по существу.'],
        'self-relationship' => ['label' => 'Отношения с собой', 'slug' => 'self-relationship', 'title' => 'Спасибо. Заявка отправлена.', 'text' => 'Валерия прочитает ваше сообщение лично и свяжется с вами.'],
        'relationships' => ['label' => 'Отношения с другими', 'slug' => 'relationships', 'title' => 'Спасибо за обращение.', 'text' => 'Валерия ознакомится с запросом и предложит возможное время встречи.'],
        'first-session' => ['label' => 'Первая сессия', 'slug' => 'first-session', 'title' => 'Первая встреча стала ближе.', 'text' => 'Валерия ответит лично и предложит удобное время.'],
        'about-meeting' => ['label' => 'Блок о психологе — встреча', 'slug' => 'meeting', 'title' => 'Спасибо. Сообщение отправлено.', 'text' => 'На первой встрече можно будет задать вопросы и понять, подходит ли вам этот формат работы.'],
        'diagnostic' => ['label' => 'Диагностика 30 минут', 'slug' => 'diagnostic', 'title' => 'Заявка на диагностику отправлена.', 'text' => 'Валерия свяжется с вами, чтобы согласовать время короткой встречи.'],
        'single-session' => ['label' => 'Одна сессия', 'slug' => 'single-session', 'title' => 'Заявка на сессию отправлена.', 'text' => 'Валерия ответит лично и предложит доступное время.'],
        'three-sessions' => ['label' => 'Пакет из трёх сессий', 'slug' => 'three-sessions', 'title' => 'Заявка на три сессии отправлена.', 'text' => 'Валерия свяжется с вами и уточнит, подходит ли этот формат для вашего запроса.'],
        'five-sessions' => ['label' => 'Пакет из пяти сессий', 'slug' => 'five-sessions', 'title' => 'Заявка на пять сессий отправлена.', 'text' => 'Валерия свяжется с вами и обсудит начало последовательной работы.'],
        'contact' => ['label' => 'Основная форма записи', 'slug' => 'contact', 'title' => 'Спасибо. Валерия получила заявку.', 'text' => 'Ответ придёт по указанному вами контакту.'],
        'footer-start' => ['label' => 'Подвал — начать работу', 'slug' => 'footer-start', 'title' => 'Спасибо. Заявка отправлена.', 'text' => 'Валерия прочитает сообщение лично и предложит следующий шаг.'],
        'method-ifs' => ['label' => 'Метод IFS', 'slug' => 'method-ifs', 'title' => 'Вопрос об IFS отправлен.', 'text' => 'Валерия уточнит задачу и объяснит, какой метод может подойти.'],
        'method-emdr' => ['label' => 'Метод EMDR', 'slug' => 'method-emdr', 'title' => 'Вопрос об EMDR отправлен.', 'text' => 'Валерия уточнит задачу и готовность к этому способу работы.'],
        'method-imtt' => ['label' => 'Метод ImTT', 'slug' => 'method-imtt', 'title' => 'Вопрос об ImTT отправлен.', 'text' => 'Валерия уточнит запрос и объяснит, подходит ли работа с образами.'],
    ];
}

function vf_form_definition(string $key): ?array
{
    $definitions = vf_form_definitions();
    return $definitions[$key] ?? null;
}

function vf_form_key_is_valid(string $key): bool
{
    return vf_form_definition($key) !== null;
}
