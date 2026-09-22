<?php
declare(strict_types=1);

require_once __DIR__ . '/lead-config.php';
require_once __DIR__ . '/form-session.php';

function vf_render_thank_you(string $formKey): never
{
    $definition = vf_form_definition($formKey);
    if ($definition === null) {
        http_response_code(404);
        exit('Not Found');
    }

    vf_require_thank_you_access($formKey, '../#contact');
    $title = htmlspecialchars((string) $definition['title'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $text = htmlspecialchars((string) $definition['text'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $conversion = htmlspecialchars($formKey, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    ?>
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="vf-conversion" content="<?= $conversion ?>">
  <title><?= $title ?> — Валерия Фридлендер</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Montserrat:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root{--navy:#202e56;--blue:#7f9fce;--pale:#dbeaf3;--cream:#fbf8e9;--paper:#fbfaf7}
    *{box-sizing:border-box}html,body{min-height:100%;margin:0}body{display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,var(--pale),var(--paper) 55%,var(--cream));color:var(--navy);font:400 14px/1.65 Montserrat,Arial,sans-serif}
    main{position:relative;width:min(820px,100%);min-height:560px;padding:clamp(42px,8vw,86px);display:flex;flex-direction:column;justify-content:center;overflow:hidden;background:rgba(255,255,255,.72);border:1px solid rgba(32,46,86,.16);box-shadow:0 28px 80px rgba(20,33,66,.14)}
    main:before,main:after{content:"";position:absolute;border:1px solid rgba(127,159,206,.38);border-radius:50%;pointer-events:none}main:before{width:360px;height:360px;right:-190px;top:-190px}main:after{width:240px;height:240px;right:-110px;top:-110px}
    .eyebrow{margin:0 0 18px;color:var(--blue);font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase}.mark{width:54px;height:54px;margin-bottom:28px;display:grid;place-items:center;border:1px solid var(--navy);border-radius:50%;font:400 26px/1 "Cormorant Garamond",serif}
    h1{max-width:650px;margin:0 0 24px;font:400 clamp(52px,8vw,84px)/.92 "Cormorant Garamond",Georgia,serif}p{max-width:590px;margin:0 0 32px}
    .actions{display:flex;align-items:center;flex-wrap:wrap;gap:20px}.back{min-height:49px;padding:0 24px;display:inline-flex;align-items:center;border:1px solid var(--navy);background:var(--navy);color:white;text-decoration:none;font-size:10px;letter-spacing:.08em;text-transform:uppercase}.telegram{color:var(--navy);text-decoration:none;border-bottom:1px solid rgba(32,46,86,.45);font-size:11px;text-transform:uppercase}
    small{margin-top:28px;font-size:9px;opacity:.62}@media(max-width:560px){body{padding:0}main{min-height:100dvh;padding:46px 22px;border:0}.actions{align-items:flex-start;flex-direction:column}}
  </style>
</head>
<body>
  <main>
    <div class="mark" aria-hidden="true">✓</div>
    <p class="eyebrow">Валерия Фридлендер · практический психолог</p>
    <h1><?= $title ?></h1>
    <p><?= $text ?></p>
    <div class="actions">
      <a class="back" href="../">Вернуться на сайт&nbsp; ⟶</a>
      <a class="telegram" href="https://t.me/Valeria_Fridlender">Написать в Telegram</a>
    </div>
    <small>Эта страница открывается только после успешно отправленной формы.</small>
  </main>
</body>
</html>
    <?php
    exit;
}
