import FontLab from "./font-lab";

const trustPoints = [
  { title: "7 лет практики", text: "1 407 проведённых сессий в индивидуальном формате" },
  { title: "2 580 часов обучения", text: "Профессиональная подготовка в IFS, EMDR и ImTT" },
  { title: "Конфиденциально", text: "Онлайн по всему миру и очные встречи в Санкт-Петербурге" },
];

const services = [
  {
    title: "Индивидуальная терапия",
    text: "Тревога, хроническое напряжение, жизненные кризисы и состояния, с которыми не удаётся справиться привычными способами.",
    image: "/images/tild3266-3864-4230-a237-396466653537__5190700468546954842.jpg",
  },
  {
    title: "Травматический опыт",
    text: "События прошлого, которые до сих пор вызывают сильные эмоциональные или телесные реакции и влияют на решения.",
    image: "/images/tild3332-3462-4231-b334-656163366338__5190700468546954841.jpg",
  },
  {
    title: "Отношения с собой",
    text: "Самокритика, стыд, внутренние конфликты, зависимость от оценки и ощущение, что вы живёте не свою жизнь.",
    image: "/images/tild3438-3931-4264-a439-386266626535__img_20260220_160404.jpg",
  },
  {
    title: "Отношения с другими",
    text: "Повторяющиеся сценарии в близких отношениях, сложность говорить о своих потребностях и удерживать границы.",
    image: "/images/tild3136-3636-4338-a538-346363396133__5242600385204131198.jpg",
  },
];

const methods = [
  {
    title: "IFS",
    subtitle: "Система внутренней семьи",
    text: "Работа с внутренними частями, которые спорят между собой, защищают привычные решения или удерживают от изменений.",
  },
  {
    title: "EMDR",
    subtitle: "Переработка травматического опыта",
    text: "Структурированный метод переработки травматических воспоминаний и связанных с ними эмоциональных и телесных реакций.",
  },
  {
    title: "ImTT",
    subtitle: "Трансформация образов",
    text: "Работа с образами, связанными с травматическим опытом, стыдом, виной и эмоциональной болью, без подробного пересказа события.",
  },
];

const steps = [
  ["01", "Первая встреча", "Уточняем запрос, контекст и то, какого результата вы ждёте от работы."],
  ["02", "План работы", "Определяем формат, методы и предварительную частоту встреч."],
  ["03", "Терапия", "Работаем с причиной повторяющихся реакций и отслеживаем изменения между сессиями."],
];

const faqs = [
  ["Как проходит первая встреча?", "Сессия длится 60 минут. Вы описываете ситуацию и ожидаемый результат, я задаю уточняющие вопросы. В конце мы определяем, с чем и в каком формате можно работать дальше."],
  ["Сколько встреч потребуется?", "Фиксированного срока нет: он зависит от запроса и глубины работы. После первой сессии можно определить предварительный план и обсудить, как отслеживать результат."],
  ["Можно ли заниматься онлайн?", "Да. Онлайн — основной формат практики. Для сессии понадобятся стабильная связь и место, где вы сможете говорить без посторонних."],
];

export default function Home() {
  return (
    <main>
      <div className="info-bar">
        <a href="tel:+79111284444">+7 911 128-44-44</a>
        <span>Онлайн по всему миру</span>
        <span>Санкт-Петербург</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Валерия Фридлендер — главная">
          <span>Валерия Фридлендер</span>
          <small>практический психолог</small>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#services">Направления</a>
          <a href="#approach">Подход</a>
          <a href="#about">Обо мне</a>
          <a href="#formats">Стоимость</a>
          <a href="#contact">Контакты</a>
        </nav>
        <a className="nav-cta" href="#contact">Начать работу <span aria-hidden="true">⟶</span></a>
      </header>

      <section className="hero" id="top">
        <img className="hero-image" src="/images/tild3534-6531-4764-a535-323831336663__img_0752.jpg" alt="Психолог Валерия Фридлендер" width="1680" height="1120" fetchPriority="high" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content">
          <h1>Валерия<br />Фридлендер</h1>
          <p className="hero-label">Психолог в Санкт-Петербурге и онлайн</p>
          <p className="hero-script">Психологическая работа без универсальных рецептов и лишних обещаний.</p>
          <p className="hero-text">Работаю с тревогой, последствиями травматического опыта, внутренними конфликтами и повторяющимися сценариями в отношениях.</p>
          <a className="button button-light" href="#contact">Записаться на консультацию</a>
        </div>
      </section>

      <section className="trust-strip" aria-label="Преимущества практики">
        {trustPoints.map((item) => <article key={item.title}><h2>{item.title}</h2><p>{item.text}</p></article>)}
      </section>

      <section className="intro-split section-shell">
        <div className="intro-photo"><img src="/images/valeria-intro-5943.webp" alt="Психолог Валерия Фридлендер" width="1600" height="2399" loading="lazy" /></div>
        <div className="intro-copy">
          <p className="eyebrow">Когда стоит обратиться</p>
          <h2>Вы понимаете, что происходит. Но привычные решения больше не работают.</h2>
          <p>Можно многое понимать о себе, продолжать работать и выполнять обязательства — и при этом снова попадать в те же реакции, конфликты и решения.</p>
          <p>Терапия нужна там, где объяснения уже есть, а устойчивых изменений нет. Мы определяем, что поддерживает проблему, и работаем с этим.</p>
          <a className="button button-outline" href="#contact">Обсудить запрос ⟶</a>
        </div>
      </section>

      <section className="services-section section-shell" id="services">
        <div className="section-heading centered-heading">
          <p className="eyebrow">Валерия Фридлендер · психологическая практика</p>
          <h2>Направления работы</h2>
          <p className="section-script">Задача терапии — не бесконечно объяснять проблему, а увидеть, что её поддерживает.</p>
          <p className="section-description">Запрос не обязан быть сформулирован идеально. Достаточно описать, что происходит и что вы хотите изменить.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <img src={service.image} alt="" width="1280" height="854" loading="lazy" />
              <div><h3>{service.title}</h3><p>{service.text}</p><a href="#contact">Подробнее</a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="promise-band">
        <p>На сессии не нужно доказывать, что вам действительно трудно.</p>
        <h2>Можно не знать правильных слов. Достаточно говорить о том, что происходит.</h2>
        <a href="#contact">Записаться на первую сессию ⟶</a>
      </section>

      <section className="methods-section section-shell" id="approach">
        <div className="methods-intro">
          <p className="eyebrow">Методы работы</p>
          <h2>Метод выбирается<br /><em>под задачу.</em></h2>
          <p>В работе использую IFS, EMDR и ImTT. Выбор метода зависит от запроса, состояния и того, как вы реагируете на процесс.</p>
        </div>
        <div className="method-list">
          {methods.map((method, index) => (
            <article key={method.title}><span>0{index + 1}</span><div><small>{method.subtitle}</small><h3>{method.title}</h3><p>{method.text}</p></div></article>
          ))}
        </div>
      </section>

      <section className="about-section section-shell" id="about">
        <div className="about-copy">
          <p className="eyebrow">Обо мне</p>
          <h2>Валерия<br /><em>Фридлендер.</em></h2>
          <p className="about-lead">Практический психолог. Семь лет веду частную практику, работаю с травматическим опытом, тревогой и внутренними конфликтами.</p>
          <p>2 580 часов профессионального обучения и 1 407 проведённых сессий. В подготовке — практическая психология, психология субличностей и травмы, IFS, EMDR и ImTT.</p>
          <a className="button button-outline" href="#contact">Записаться на встречу ⟶</a>
        </div>
        <div className="about-photo"><img src="/images/tild6461-6666-4637-b236-366364393738__img_7708.jpg" alt="Валерия Фридлендер" width="1680" height="2240" loading="lazy" /></div>
      </section>

      <section className="process-section section-shell">
        <div className="section-heading centered-heading">
          <p className="eyebrow">Как начать</p><h2>Как устроено начало работы</h2>
          <p className="section-script">Сначала определяем задачу. После первой встречи вы решаете, продолжать ли терапию.</p>
        </div>
        <div className="steps-grid">
          {steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="formats-section" id="formats">
        <div className="formats-inner section-shell">
          <div className="formats-heading"><p className="eyebrow eyebrow-light">Форматы и стоимость</p><h2>Онлайн-сессии.</h2><p>Разовая консультация или пакет встреч для последовательной работы с запросом.</p></div>
          <div className="price-list">
            <article><span>Диагностика</span><small>30 минут · краткий разбор ситуации</small><strong>0 ₽</strong></article>
            <article><span>1 сессия</span><small>60 минут · работа с запросом</small><strong>10 000 ₽</strong></article>
            <article><span>3 сессии</span><small>3 × 60 минут · скидка 20%</small><strong>24 000 ₽</strong></article>
            <article><span>5 сессий</span><small>5 × 60 минут · скидка 30%</small><strong>35 000 ₽</strong></article>
          </div>
        </div>
      </section>

      <section className="faq-section section-shell">
        <div className="faq-title"><p className="eyebrow">Вопросы</p><h2>До первой встречи</h2></div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{question}</span><i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-shade" aria-hidden="true" />
        <div className="contact-inner">
          <p className="eyebrow eyebrow-light">Запись на сессию</p>
          <h2>Опишите запрос.<br /><em>Я отвечу лично.</em></h2>
          <p>В первом сообщении достаточно кратко написать, что происходит. Я отвечу на вопросы и предложу время для встречи.</p>
          <div><a className="button button-light" href="https://t.me/Valeria_Fridlender">Написать в Telegram</a><a className="contact-link" href="https://wa.me/79111284444">WhatsApp ⟶</a></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-intro">
            <div className="footer-brand"><span>Валерия Фридлендер</span><small>практический психолог</small></div>
            <p>Индивидуальная психологическая работа онлайн и в Санкт-Петербурге.</p>
            <a className="footer-button" href="https://t.me/Valeria_Fridlender">Начать работу ⟶</a>
          </div>

          <div className="footer-column">
            <h3>Навигация</h3>
            <a href="#services">Направления работы</a>
            <a href="#approach">Методы</a>
            <a href="#about">О Валерии</a>
            <a href="#formats">Форматы и стоимость</a>
            <a href="#contact">Запись</a>
          </div>

          <div className="footer-column">
            <h3>Направления</h3>
            <a href="#services">Индивидуальная терапия</a>
            <a href="#services">Тревога и стресс</a>
            <a href="#services">Травматический опыт</a>
            <a href="#services">Отношения с собой</a>
            <a href="#services">Отношения с другими</a>
          </div>

          <div className="footer-column footer-contacts">
            <h3>Контакты</h3>
            <a href="tel:+79111284444">+7 911 128-44-44</a>
            <a href="mailto:valeryafridlender@gmail.com">valeryafridlender@gmail.com</a>
            <span>Санкт-Петербург</span>
            <span>Онлайн по всему миру</span>
            <div><a href="https://t.me/Valeria_Fridlender">Telegram</a><a href="https://vk.com/lerapsy">VKontakte</a></div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Валерия Фридлендер</span>
          <div><a href="/privacy-policy">Политика конфиденциальности</a><a href="/personal-data-consent">Согласие на обработку данных</a></div>
        </div>
      </footer>
      <FontLab />
    </main>
  );
}
