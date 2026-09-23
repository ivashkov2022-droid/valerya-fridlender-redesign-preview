"use client";

import { useCallback, useState } from "react";
import FontLab from "./font-lab";
import { LeadFormKey, LeadModal, MethodDrawer, MethodKey, ServiceKey, ServiceModal } from "./lead-funnels";

const trustPoints = [
  { title: "7 лет практики", text: "1 407 проведённых сессий в индивидуальном формате" },
  { title: "2 580 часов обучения", text: "Профессиональная подготовка в IFS, EMDR и ImTT" },
  { title: "Конфиденциально", text: "Онлайн по всему миру и очные встречи в Санкт-Петербурге" },
];

const services = [
  {
    key: "individual-therapy" as ServiceKey,
    title: "Индивидуальная терапия",
    text: "Тревога, хроническое напряжение, жизненные кризисы и состояния, с которыми не удаётся справиться привычными способами.",
    image: "images/tild3830-3162-4235-b462-373165303535__img_7743.jpg",
  },
  {
    key: "trauma-experience" as ServiceKey,
    title: "Травматический опыт",
    text: "События прошлого, которые до сих пор вызывают сильные эмоциональные или телесные реакции и влияют на решения.",
    image: "images/tild3332-3462-4231-b334-656163366338__5190700468546954841.jpg",
  },
  {
    key: "self-relationship" as ServiceKey,
    title: "Отношения с собой",
    text: "Самокритика, стыд, внутренние конфликты, зависимость от оценки и ощущение, что вы живёте не свою жизнь.",
    image: "images/tild3438-3931-4264-a439-386266626535__img_20260220_160404.jpg",
  },
  {
    key: "relationships" as ServiceKey,
    title: "Отношения с другими",
    text: "Повторяющиеся сценарии в близких отношениях, сложность говорить о своих потребностях и удерживать границы.",
    image: "images/tild3136-3636-4338-a538-346363396133__5242600385204131198.jpg",
  },
];

const formats: { key: LeadFormKey; title: string; text: string; price: string }[] = [
  { key: "diagnostic", title: "Диагностика", text: "30 минут · краткий разбор ситуации", price: "0 ₽" },
  { key: "single-session", title: "1 сессия", text: "60 минут · работа с запросом", price: "10 000 ₽" },
  { key: "three-sessions", title: "3 сессии", text: "3 × 60 минут · скидка 20%", price: "24 000 ₽" },
  { key: "five-sessions", title: "5 сессий", text: "5 × 60 минут · скидка 30%", price: "35 000 ₽" },
];

const methods = [
  {
    key: "ifs" as MethodKey,
    title: "IFS",
    subtitle: "Система внутренней семьи",
    text: "Работа с внутренними частями, которые спорят между собой, защищают привычные решения или удерживают от изменений.",
  },
  {
    key: "emdr" as MethodKey,
    title: "EMDR",
    subtitle: "Переработка травматического опыта",
    text: "Структурированный метод переработки травматических воспоминаний и связанных с ними эмоциональных и телесных реакций.",
  },
  {
    key: "imtt" as MethodKey,
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

function positionFormatPrompt(button: HTMLButtonElement, clientX: number, clientY: number) {
  const bounds = button.getBoundingClientRect();
  const promptSize = 62;
  const inset = 4;
  const offset = 10;
  const price = button.parentElement?.querySelector("strong")?.getBoundingClientRect();
  const availableBeforePrice = price ? price.left - bounds.left - promptSize - 14 : bounds.width - promptSize - inset;
  const maxX = Math.max(inset, Math.min(bounds.width - promptSize - inset, availableBeforePrice));
  const x = Math.min(Math.max(clientX - bounds.left + offset, inset), maxX);
  const y = Math.min(Math.max(clientY - bounds.top + offset, inset), bounds.height - promptSize - inset);

  button.style.setProperty("--format-pointer-x", `${x}px`);
  button.style.setProperty("--format-pointer-y", `${y}px`);
  button.dataset.cursor = "true";
}

function positionFormatsOverviewPrompt(button: HTMLButtonElement, clientX: number, clientY: number) {
  const bounds = button.getBoundingClientRect();
  const promptSize = 62;
  const inset = 8;
  const offset = 12;
  const x = Math.min(Math.max(clientX - bounds.left + offset, inset), bounds.width - promptSize - inset);
  const y = Math.min(Math.max(clientY - bounds.top + offset, inset), bounds.height - promptSize - inset);

  button.style.setProperty("--formats-overview-pointer-x", `${x}px`);
  button.style.setProperty("--formats-overview-pointer-y", `${y}px`);
  button.dataset.cursor = "true";
}

export default function Home() {
  const [activeForm, setActiveForm] = useState<LeadFormKey | null>(null);
  const [activeService, setActiveService] = useState<ServiceKey | null>(null);
  const [activeMethod, setActiveMethod] = useState<MethodKey | null>(null);
  const closeForm = useCallback(() => setActiveForm(null), []);
  const closeService = useCallback(() => setActiveService(null), []);
  const closeMethod = useCallback(() => setActiveMethod(null), []);

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
        <button className="nav-cta lead-trigger" type="button" onClick={() => setActiveForm("header-start")}>Начать работу <span aria-hidden="true">⟶</span></button>
      </header>

      <section className="hero" id="top">
        <img className="hero-image" src="images/tild3534-6531-4764-a535-323831336663__img_0752.jpg" alt="Психолог Валерия Фридлендер" width="1680" height="1120" fetchPriority="high" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content">
          <h1>Валерия<br />Фридлендер</h1>
          <p className="hero-label">Психолог в Санкт-Петербурге и онлайн</p>
          <p className="hero-script">Психологическая работа без универсальных рецептов и лишних обещаний</p>
          <p className="hero-text">Работаю с тревогой, последствиями травматического опыта, внутренними конфликтами и повторяющимися сценариями в отношениях</p>
          <button className="button button-light lead-trigger" type="button" onClick={() => setActiveForm("hero-consultation")}>Записаться на консультацию</button>
        </div>
      </section>

      <section className="trust-strip" aria-label="Преимущества практики">
        {trustPoints.map((item) => <article key={item.title}><h2>{item.title}</h2><p>{item.text}</p></article>)}
      </section>

      <section className="intro-split section-shell">
        <div className="intro-photo"><img src="images/valeria-intro-5943.webp" alt="Психолог Валерия Фридлендер" width="1600" height="2399" loading="lazy" /></div>
        <div className="intro-copy">
          <p className="eyebrow">Когда стоит обратиться</p>
          <h2>Вы понимаете, что происходит. Но привычные решения больше не работают.</h2>
          <p>Можно многое понимать о себе, продолжать работать и выполнять обязательства — и при этом снова попадать в те же реакции, конфликты и решения.</p>
          <p>Терапия нужна там, где объяснения уже есть, а устойчивых изменений нет. Мы определяем, что поддерживает проблему, и работаем с этим.</p>
          <button className="button button-outline lead-trigger" type="button" onClick={() => setActiveForm("discuss-request")}>Обсудить запрос ⟶</button>
        </div>
      </section>

      <section className="services-section section-shell" id="services">
        <div className="section-heading centered-heading">
          <p className="eyebrow">Валерия Фридлендер · психологическая практика</p>
          <h2>Направления работы</h2>
          <p className="section-script">Задача терапии — не бесконечно объяснять проблему, а увидеть, что её поддерживает</p>
          <p className="section-description">Запрос не обязан быть сформулирован идеально. Достаточно описать, что происходит и что вы хотите изменить.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <img src={service.image} alt="" width="1280" height="854" loading="lazy" />
              <div><h3>{service.title}</h3><p>{service.text}</p><button type="button" onClick={() => setActiveService(service.key)}>Подробнее</button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="promise-band">
        <p>На сессии не нужно доказывать, что вам действительно трудно.</p>
        <h2>Можно не знать правильных слов. Достаточно говорить о том, что происходит.</h2>
        <button type="button" onClick={() => setActiveForm("first-session")}>Записаться на первую сессию ⟶</button>
      </section>

      <section className="methods-section section-shell" id="approach">
        <div className="methods-intro">
          <p className="eyebrow">Методы работы</p>
          <h2>Метод выбирается<br /><em>под задачу</em></h2>
          <p>В работе использую IFS, EMDR и ImTT. Выбор метода зависит от запроса, состояния и того, как вы реагируете на процесс.</p>
        </div>
        <div className="method-list">
          {methods.map((method, index) => (
            <article key={method.title}>
              <span>0{index + 1}</span>
              <div><small>{method.subtitle}</small><h3>{method.title}</h3><p>{method.text}</p></div>
              <button className="method-open" type="button" onClick={() => setActiveMethod(method.key)} aria-label={`Подробнее о методе ${method.title}`}><span aria-hidden="true">↗</span></button>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section section-shell" id="about">
        <div className="about-copy">
          <p className="eyebrow">Обо мне</p>
          <h2>Валерия<br /><em>Фридлендер</em></h2>
          <p className="about-lead">Практический психолог. Семь лет веду частную практику, работаю с травматическим опытом, тревогой и внутренними конфликтами.</p>
          <p>2 580 часов профессионального обучения и 1 407 проведённых сессий. В подготовке — практическая психология, психология субличностей и травмы, IFS, EMDR и ImTT.</p>
          <button className="button button-outline lead-trigger" type="button" onClick={() => setActiveForm("about-meeting")}>Записаться на встречу ⟶</button>
        </div>
        <div className="about-photo"><img src="images/tild6461-6666-4637-b236-366364393738__img_7708.jpg" alt="Валерия Фридлендер" width="1680" height="2240" loading="lazy" /></div>
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
          <div className="formats-heading">
            <p className="eyebrow eyebrow-light">Форматы и стоимость</p>
            <h2>Онлайн<span className="formats-hyphen">-</span>сессии</h2>
            <p>Разовая консультация или пакет встреч для последовательной работы с запросом.</p>
            <button
              className="formats-overview-select"
              type="button"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") positionFormatsOverviewPrompt(event.currentTarget, event.clientX, event.clientY);
              }}
              onPointerMove={(event) => {
                if (event.pointerType === "mouse") positionFormatsOverviewPrompt(event.currentTarget, event.clientX, event.clientY);
              }}
              onPointerLeave={(event) => { delete event.currentTarget.dataset.cursor; }}
              onPointerCancel={(event) => { delete event.currentTarget.dataset.cursor; }}
              onClick={(event) => {
                delete event.currentTarget.dataset.cursor;
                setActiveForm("first-session");
              }}
              aria-label="Выбрать онлайн-сессию"
            >
              <span aria-hidden="true"><b>Выбрать</b></span>
            </button>
          </div>
          <div className="price-list">
            {formats.map((format) => (
              <article className="format-option" key={format.key}>
                <span>{format.title}</span><small id={`${format.key}-details`}>{format.text}</small><strong id={`${format.key}-price`}>{format.price}</strong>
                <button
                  className="format-select"
                  type="button"
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") {
                      const overview = event.currentTarget.closest(".formats-inner")?.querySelector<HTMLButtonElement>(".formats-overview-select");
                      if (overview) delete overview.dataset.cursor;
                      positionFormatPrompt(event.currentTarget, event.clientX, event.clientY);
                    }
                  }}
                  onPointerMove={(event) => {
                    if (event.pointerType === "mouse") positionFormatPrompt(event.currentTarget, event.clientX, event.clientY);
                  }}
                  onPointerLeave={(event) => { delete event.currentTarget.dataset.cursor; }}
                  onPointerCancel={(event) => { delete event.currentTarget.dataset.cursor; }}
                  onClick={() => setActiveForm(format.key)}
                  aria-label={`Выбрать формат: ${format.title}`}
                  aria-describedby={`${format.key}-details ${format.key}-price`}
                >
                  <span aria-hidden="true"><b>Выбрать</b></span>
                </button>
              </article>
            ))}
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
        <img
          className="contact-photo"
          src="images/tild3236-3363-4432-a238-353234313366__img_7710.jpg"
          alt=""
          width="1680"
          height="2100"
          loading="eager"
          decoding="async"
        />
        <div className="contact-shade" aria-hidden="true" />
        <div className="contact-inner">
          <p className="eyebrow eyebrow-light">Запись на сессию</p>
          <h2>Опишите запрос.<br /><em>Я отвечу лично.</em></h2>
          <p>В первом сообщении достаточно кратко написать, что происходит. Я отвечу на вопросы и предложу время для встречи.</p>
          <div className="contact-actions"><button className="button button-light" type="button" onClick={() => setActiveForm("contact")}>Оставить заявку</button><a className="contact-link" href="https://t.me/Valeria_Fridlender">Telegram ⟶</a></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-intro">
            <div className="footer-brand"><span>Валерия Фридлендер</span><small>практический психолог</small></div>
            <p>Индивидуальная психологическая работа онлайн и в Санкт-Петербурге.</p>
            <button className="footer-button lead-trigger" type="button" onClick={() => setActiveForm("footer-start")}>Начать работу ⟶</button>
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
          <div><a href="privacy-policy.html">Политика конфиденциальности</a><a href="personal-data-consent.html">Согласие на обработку данных</a></div>
        </div>
      </footer>
      {activeMethod && <MethodDrawer methodKey={activeMethod} onClose={closeMethod} onDiscuss={(formKey) => { setActiveMethod(null); setActiveForm(formKey); }} />}
      {activeService && <ServiceModal serviceKey={activeService} onClose={closeService} onContact={(formKey) => { setActiveService(null); setActiveForm(formKey); }} />}
      {activeForm && <LeadModal formKey={activeForm} onClose={closeForm} />}
      <FontLab />
    </main>
  );
}
