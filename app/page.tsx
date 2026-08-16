import Image from "next/image";

const requests = [
  {
    number: "01",
    title: "Рядом, но не вместе",
    text: "Отношения продолжаются, а близость и ощущение себя в них постепенно исчезают.",
  },
  {
    number: "02",
    title: "Тревога не выключается",
    text: "Даже когда всё спокойно, внутри остаётся готовность к тому, что сейчас случится плохое.",
  },
  {
    number: "03",
    title: "Трудно выбрать себя",
    text: "Вы соглашаетесь раньше, чем успеваете понять, чего хотите и где проходят ваши границы.",
  },
  {
    number: "04",
    title: "Сценарии повторяются",
    text: "Меняются люди и обстоятельства, но знакомое чувство бессилия возвращается снова.",
  },
];

const methods = [
  {
    short: "IFS",
    name: "Система внутренней семьи",
    text: "Помогает замечать разные внутренние части без борьбы с собой и понимать, какую задачу каждая из них пытается решить.",
  },
  {
    short: "EMDR",
    name: "Десенсибилизация и переработка",
    text: "Подход к воспоминаниям и событиям прошлого, которые до сих пор вызывают интенсивную эмоциональную реакцию.",
  },
  {
    short: "IMTT",
    name: "Образная трансформация",
    text: "Работа с тяжёлыми переживаниями через образы и телесные отклики — бережно, без требования подробно пересказывать всё заново.",
  },
];

const formats = [
  {
    label: "Одна встреча",
    price: "10 000 ₽",
    note: "60 минут",
    text: "Для конкретного запроса или чтобы начать работу без обязательства продолжать цикл.",
  },
  {
    label: "Цикл из 3 встреч",
    price: "24 000 ₽",
    note: "по 60 минут",
    text: "Чтобы последовательно разобрать ситуацию, увидеть связи и попробовать новые способы действовать.",
  },
  {
    label: "Цикл из 5 встреч",
    price: "35 000 ₽",
    note: "по 60 минут",
    text: "Для более глубокой работы с повторяющимся сценарием и устойчивыми внутренними реакциями.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__background" aria-hidden="true" />
        <div className="hero__veil" aria-hidden="true" />

        <header className="site-header shell">
          <a className="brand" href="#top" aria-label="На начало страницы">
            ВФ<span>.</span>
          </a>
          <nav className="desktop-nav" aria-label="Основная навигация">
            <a href="#requests">С чем работаю</a>
            <a href="#approach">Подход</a>
            <a href="#formats">Форматы</a>
            <a href="#about">Обо мне</a>
          </nav>
          <a className="header-link" href="#contact">
            Записаться <span aria-hidden="true">↗</span>
          </a>
        </header>

        <div className="hero__name" aria-hidden="true">
          <span>Валерия</span>
          <span>Фридлендер</span>
        </div>

        <Image
          className="hero__portrait"
          src="/valeria-hero.png"
          alt="Психолог Валерия Фридлендер"
          width={1680}
          height={1355}
          priority
        />

        <div className="hero__content shell" id="top">
          <div className="hero__eyebrow">
            <span className="pulse" aria-hidden="true" />
            Личный психолог · онлайн
          </div>
          <h1 id="hero-title">
            Для тех, кто устал
            <br />
            <em>быть сильным за всех</em>
          </h1>
          <p className="hero__lead">
            Пространство, где не нужно соответствовать. Разберём, что происходит,
            и определим возможные следующие шаги — в вашем темпе.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#contact">
              Обсудить запрос <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#process">
              Как проходит первая встреча
            </a>
          </div>
        </div>

        <div className="hero__facts shell" aria-label="Коротко о практике">
          <span><b>7 лет</b> практики</span>
          <span><b>Онлайн</b> по всему миру</span>
          <span><b>IFS · EMDR · IMTT</b> методы работы</span>
        </div>
      </section>

      <section className="requests section shell" id="requests" aria-labelledby="requests-title">
        <div className="section-heading">
          <p className="section-index">01 / С чем можно прийти</p>
          <h2 id="requests-title">
            Иногда сила становится способом
            <em> не замечать, как тяжело.</em>
          </h2>
          <p className="section-intro">
            Не обязательно ждать, пока ситуация станет невыносимой. Достаточно ощущения,
            что привычный способ справляться больше не помогает.
          </p>
        </div>

        <div className="request-grid">
          {requests.map((request) => (
            <article className="request-card" key={request.number}>
              <span className="request-card__number">{request.number}</span>
              <h3>{request.title}</h3>
              <p>{request.text}</p>
              <span className="request-card__mark" aria-hidden="true">↘</span>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto" aria-label="Принцип работы">
        <div className="manifesto__line" aria-hidden="true">
          Не исправлять · не торопить · не оценивать ·
        </div>
        <div className="manifesto__content shell">
          <p>Задача не в том, чтобы стать «правильной версией себя».</p>
          <blockquote>
            А в том, чтобы вернуть себе право чувствовать, выбирать и действовать
            <em> не против себя.</em>
          </blockquote>
        </div>
      </section>

      <section className="approach section shell" id="approach" aria-labelledby="approach-title">
        <div className="approach__image-wrap">
          <Image
            className="approach__image"
            src="/valeria-about.jpg"
            alt="Валерия Фридлендер в рабочем кабинете"
            width={1680}
            height={2342}
            sizes="(max-width: 760px) 100vw, 44vw"
          />
          <div className="approach__caption">
            <span>Валерия Фридлендер</span>
            <span>Психолог · 7 лет практики</span>
          </div>
        </div>

        <div className="approach__content">
          <p className="section-index">02 / Подход</p>
          <h2 id="approach-title">
            Работа начинается
            <em> не с метода, а с вас.</em>
          </h2>
          <p className="approach__lead">
            Мне важно понимать не только то, что происходит сейчас, но и контекст:
            как вы привыкли справляться, что уже пробовали и какой темп для вас безопасен.
          </p>
          <p>
            На встречах не нужно быть удобной, собранной или заранее знать «правильный»
            запрос. Мы уточняем его вместе и выбираем способ работы, который подходит
            именно этой ситуации.
          </p>

          <div className="approach__principles">
            <div><b>Ясные рамки</b><span>Формат, стоимость и правила известны заранее.</span></div>
            <div><b>Без давления</b><span>Интенсивность работы определяется вместе.</span></div>
            <div><b>Конфиденциально</b><span>Содержание встреч остаётся между нами.</span></div>
          </div>
        </div>
      </section>

      <section className="process section" id="process" aria-labelledby="process-title">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <div>
              <p className="section-index">03 / Первая встреча</p>
              <h2 id="process-title">Сначала — понять, <em>подходим ли мы друг другу.</em></h2>
            </div>
            <p className="section-intro">
              Первая встреча не обязывает продолжать. Это время, чтобы назвать главное,
              задать вопросы и получить ясное представление о дальнейшей работе.
            </p>
          </div>

          <ol className="process-list">
            <li>
              <span>01</span>
              <h3>Вы рассказываете столько, сколько готовы</h3>
              <p>Не нужно заранее составлять идеальную историю или вспоминать всё по порядку.</p>
            </li>
            <li>
              <span>02</span>
              <h3>Мы уточняем запрос</h3>
              <p>Отделяем срочное от важного и формулируем, что может стать целью работы.</p>
            </li>
            <li>
              <span>03</span>
              <h3>Обсуждаем следующие шаги</h3>
              <p>Вы выбираете подходящий формат и принимаете решение без давления.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="methods section shell" aria-labelledby="methods-title">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-index">04 / Методики</p>
            <h2 id="methods-title">Метод — это инструмент. <em>Не обещание чуда.</em></h2>
          </div>
          <p className="section-intro">
            Подход выбирается после знакомства с вашей ситуацией. Иногда достаточно
            разговора и наблюдения; иногда полезна более структурированная работа.
          </p>
        </div>

        <div className="method-list">
          {methods.map((method) => (
            <article className="method" key={method.short}>
              <span className="method__short">{method.short}</span>
              <h3>{method.name}</h3>
              <p>{method.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about section" id="about" aria-labelledby="about-title">
        <div className="about__image-column">
          <Image
            className="about__image"
            src="/valeria-window.jpg"
            alt="Валерия Фридлендер у окна"
            width={1680}
            height={2100}
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        </div>
        <div className="about__content">
          <p className="section-index">05 / Обо мне</p>
          <h2 id="about-title">Профессионально. Прямо. <em>По-человечески.</em></h2>
          <p className="about__lead">
            Я работаю с людьми, которые многое могут и привыкли выдерживать — но больше
            не хотят платить за эту силу собой.
          </p>
          <p>
            В практике соединяю системный взгляд, внимание к эмоциональному опыту и
            современные методы работы с травматическими переживаниями. Регулярно прохожу
            обучение и супервизию.
          </p>
          <div className="about__facts">
            <div><strong>7</strong><span>лет практики</span></div>
            <div><strong>3</strong><span>основных метода</span></div>
            <div><strong>1:1</strong><span>индивидуальный формат</span></div>
          </div>
          <a className="inline-link" href="#contact">Задать вопрос до записи <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="formats section shell" id="formats" aria-labelledby="formats-title">
        <div className="section-heading section-heading--split">
          <div>
            <p className="section-index">06 / Форматы и стоимость</p>
            <h2 id="formats-title">Понятные условия <em>до начала работы.</em></h2>
          </div>
          <div className="intro-callout">
            <span>Короткое знакомство онлайн</span>
            <strong>0 ₽</strong>
            <p>Чтобы задать вопросы и понять, подходит ли вам формат.</p>
          </div>
        </div>

        <div className="format-grid">
          {formats.map((format, index) => (
            <article className={`format-card${index === 0 ? " format-card--accent" : ""}`} key={format.label}>
              <span className="format-card__index">0{index + 1}</span>
              <h3>{format.label}</h3>
              <div className="format-card__price">{format.price}</div>
              <span className="format-card__note">{format.note}</span>
              <p>{format.text}</p>
              <a href="#contact">Выбрать формат <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="faq section shell" aria-labelledby="faq-title">
        <div className="faq__title">
          <p className="section-index">07 / Вопросы</p>
          <h2 id="faq-title">Перед тем, <em>как написать.</em></h2>
        </div>
        <div className="faq__list">
          <details>
            <summary>Как понять, что мне подходит этот формат?</summary>
            <p>Можно начать с короткого знакомства: обозначить ситуацию, задать вопросы и только после этого решить, нужна ли полноценная встреча.</p>
          </details>
          <details>
            <summary>Как проходит онлайн-сессия?</summary>
            <p>Мы встречаемся по видеосвязи в согласованное время. Для разговора желательно выбрать спокойное место, где вас не будут отвлекать.</p>
          </details>
          <details>
            <summary>Сколько встреч понадобится?</summary>
            <p>Это зависит от запроса и желаемой глубины работы. Мы обсуждаем ориентир после знакомства и можем пересматривать его по ходу процесса.</p>
          </details>
          <details>
            <summary>Можно ли обратиться в остром кризисе?</summary>
            <p>Сайт не является экстренной службой. При непосредственной угрозе жизни или здоровью важно обратиться в местную экстренную службу; в России — по номеру 112.</p>
          </details>
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact__glow" aria-hidden="true" />
        <div className="contact__content shell">
          <p className="section-index">08 / Начать разговор</p>
          <h2 id="contact-title">Не нужно писать длинно. <em>Достаточно: «хочу обсудить запрос».</em></h2>
          <p>
            Выберите удобный мессенджер. Валерия ответит лично и предложит ближайшее время.
          </p>
          <div className="contact__actions">
            <a className="button button--primary" href="https://t.me/Valeria_Fridlender" target="_blank" rel="noreferrer">
              Написать в Telegram <span aria-hidden="true">↗</span>
            </a>
            <a className="button button--ghost" href="https://wa.me/79111284444" target="_blank" rel="noreferrer">
              Написать в WhatsApp <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className="contact__name" aria-hidden="true">Валерия Фридлендер</div>
      </section>

      <footer className="footer shell">
        <span>© {new Date().getFullYear()} Валерия Фридлендер</span>
        <span>Психологические консультации онлайн</span>
        <a href="#top">Наверх ↑</a>
      </footer>
    </main>
  );
}
