import FontLab from "./font-lab";

const trustPoints = [
  { title: "Практика онлайн", text: "Сессии из любой страны и очные встречи в Санкт-Петербурге" },
  { title: "Доказательный подход", text: "IFS, EMDR и ImTT — методы, которые подбираются под ваш запрос" },
  { title: "Бережно и конфиденциально", text: "Пространство без оценок, давления и необходимости быть удобным" },
];

const services = [
  {
    title: "Индивидуальная терапия",
    text: "Поддержка при тревоге, стрессе, жизненных переменах и ощущении, что вы потеряли контакт с собой.",
    image: "/images/tild3266-3864-4230-a237-396466653537__5190700468546954842.jpg",
  },
  {
    title: "Травматический опыт",
    text: "Работа с прошлым опытом, который продолжает влиять на чувства, решения и реакции в настоящем.",
    image: "/images/tild3332-3462-4231-b334-656163366338__5190700468546954841.jpg",
  },
  {
    title: "Отношения с собой",
    text: "Самооценка, внутренние конфликты, жёсткая самокритика и привычка постоянно требовать от себя большего.",
    image: "/images/tild3438-3931-4264-a439-386266626535__img_20260220_160404.jpg",
  },
  {
    title: "Отношения с другими",
    text: "Повторяющиеся сценарии, сложности с близостью, границами и возможностью быть услышанным.",
    image: "/images/tild3136-3636-4338-a538-346363396133__5242600385204131198.jpg",
  },
];

const methods = [
  {
    title: "IFS",
    subtitle: "Система внутренней семьи",
    text: "Помогает услышать разные части личности, уменьшить внутреннюю борьбу и вернуть спокойное управление своей жизнью.",
  },
  {
    title: "EMDR",
    subtitle: "Переработка травматического опыта",
    text: "Помогает мозгу переработать тяжёлые события, чтобы воспоминания перестали запускать прежние реакции.",
  },
  {
    title: "ImTT",
    subtitle: "Трансформация образов",
    text: "Бережная работа с эмоциональной болью через образы — без необходимости заново подробно проживать травму.",
  },
];

const steps = [
  ["01", "Знакомство", "Обсуждаем, что происходит сейчас, и определяем запрос."],
  ["02", "Маршрут", "Выбираем подходящий формат, направление и комфортный темп."],
  ["03", "Работа", "Меняем старые реакции и переносим новые способы справляться в жизнь."],
];

const faqs = [
  ["Как проходит первая встреча?", "Сессия длится около 50 минут. Мы знакомимся, обсуждаем то, что беспокоит вас сейчас, и вместе определяем возможное направление работы. Рассказывать больше, чем вы готовы, не нужно."],
  ["Сколько встреч потребуется?", "Это зависит от запроса и желаемой глубины изменений. Иногда нескольких встреч достаточно для ясности, а для устойчивой глубокой работы требуется больше времени."],
  ["Можно ли заниматься онлайн?", "Да. Основной формат практики — онлайн-сессии из любой страны. Понадобятся только тихое личное пространство и стабильная связь."],
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
          <p className="hero-script">Современная терапия для спокойной и своей жизни.</p>
          <p className="hero-text">Помогаю справляться с тревогой, травматическим опытом и внутренними конфликтами, возвращая опору на себя.</p>
          <a className="button button-light" href="#contact">Записаться на знакомство</a>
        </div>
      </section>

      <section className="trust-strip" aria-label="Преимущества практики">
        {trustPoints.map((item) => <article key={item.title}><h2>{item.title}</h2><p>{item.text}</p></article>)}
      </section>

      <section className="intro-split section-shell">
        <div className="intro-photo"><img src="/images/tild3266-3864-4230-a237-396466653537__5190700468546954842.jpg" alt="Психологическая консультация" width="1280" height="854" loading="lazy" /></div>
        <div className="intro-copy">
          <p className="eyebrow">Терапия для реальной жизни</p>
          <h2>Снаружи всё может выглядеть хорошо. Внутри — ощущаться совсем иначе.</h2>
          <p>Можно быть ответственным, успешным и привычно держать всё под контролем — и одновременно чувствовать тревогу, усталость или одиночество.</p>
          <p>В терапии мы сокращаем расстояние между тем, какой вашу жизнь видят другие, и тем, как вы на самом деле её проживаете.</p>
          <a className="button button-outline" href="#contact">Начать работу ⟶</a>
        </div>
      </section>

      <section className="services-section section-shell" id="services">
        <div className="section-heading centered-heading">
          <p className="eyebrow">Валерия Фридлендер · психологическая практика</p>
          <h2>Направления работы</h2>
          <p className="section-script">Терапия может быть современной, глубокой и человечной.</p>
          <p className="section-description">Не обязательно точно знать название проблемы. Достаточно выбрать то, что больше всего похоже на ваше состояние сейчас.</p>
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
        <p>Работа со специалистом не должна ощущаться как ещё один экзамен.</p>
        <h2>Здесь не нужно быть сильнее, правильнее или удобнее.</h2>
        <a href="#contact">Познакомиться с Валерией ⟶</a>
      </section>

      <section className="methods-section section-shell" id="approach">
        <div className="methods-intro">
          <p className="eyebrow">Методы</p>
          <h2>Точно к причине.<br /><em>Бережно к человеку.</em></h2>
          <p>Подход подбирается под ваш опыт и состояние. Метод — это инструмент, а не схема, которой человек обязан соответствовать.</p>
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
          <h2>Привет,<br /><em>я Валерия.</em></h2>
          <p className="about-lead">Я практический психолог. Уже пять лет помогаю людям превращать растерянность в понимание, а страх — в движение вперёд.</p>
          <p>За плечами более 1 500 часов профессионального обучения и более 1 000 проведённых сессий. Но главное в работе для меня — живой контакт, уважение к вашему темпу и честность.</p>
          <a className="button button-outline" href="#contact">Записаться на встречу ⟶</a>
        </div>
        <div className="about-photo"><img src="/images/tild6461-6666-4637-b236-366364393738__img_7708.jpg" alt="Валерия Фридлендер" width="1680" height="2240" loading="lazy" /></div>
      </section>

      <section className="process-section section-shell">
        <div className="section-heading centered-heading">
          <p className="eyebrow">Как начать</p><h2>Путь начинается с одной встречи</h2>
          <p className="section-script">Без обязательств продолжать и без необходимости заранее знать все ответы.</p>
        </div>
        <div className="steps-grid">
          {steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="formats-section" id="formats">
        <div className="formats-inner section-shell">
          <div className="formats-heading"><p className="eyebrow eyebrow-light">Форматы и стоимость</p><h2>Поддержка в нужном объёме.</h2><p>Формат и количество встреч определяем вместе после знакомства.</p></div>
          <div className="price-list">
            <article><span>Индивидуальная сессия</span><small>50 минут · онлайн</small><strong>10 000 ₽</strong></article>
            <article><span>Фокус</span><small>3 встречи с конкретной целью</small><strong>24 000 ₽</strong></article>
            <article><span>Гармония</span><small>5 встреч для глубокой работы</small><strong>35 000 ₽</strong></article>
            <article><span>Малая группа</span><small>До пяти участников</small><strong>от 5 000 ₽</strong></article>
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
          <p className="eyebrow eyebrow-light">Готовы начать?</p>
          <h2>Давайте найдём точку,<br /><em>с которой станет легче.</em></h2>
          <p>Коротко расскажите, что вас беспокоит, и мы подберём время для знакомства.</p>
          <div><a className="button button-light" href="https://t.me/Valeria_Fridlender">Написать в Telegram</a></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-intro">
            <div className="footer-brand"><span>Валерия Фридлендер</span><small>практический психолог</small></div>
            <p>Современная психологическая помощь с уважением к вашему опыту и темпу.</p>
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
