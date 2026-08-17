const trustPoints = [
  {
    title: "5 лет практики",
    text: "Более 1000 проведённых сессий",
  },
  {
    title: "Доказательные методы",
    text: "IFS, EMDR и ImTT в бережной работе",
  },
  {
    title: "Онлайн по всему миру",
    text: "Индивидуально и в малых группах",
  },
];

const directions = [
  {
    number: "01",
    title: "Тревога и стресс",
    text: "Когда мысли не останавливаются, а внутри постоянно ждёшь, что что-то пойдёт не так.",
  },
  {
    number: "02",
    title: "Травматический опыт",
    text: "Когда прошлое продолжает влиять на настоящее, хотя кажется, что всё уже давно позади.",
  },
  {
    number: "03",
    title: "Внутренние конфликты",
    text: "Когда одна часть вас хочет перемен, а другая удерживает в привычном и безопасном.",
  },
  {
    number: "04",
    title: "Отношения",
    text: "Когда близость перестала давать опору, а повторяющиеся сценарии причиняют боль.",
  },
  {
    number: "05",
    title: "Самооценка",
    text: "Когда требования к себе растут быстрее достижений и невозможно почувствовать: «я достаточно хороша».",
  },
  {
    number: "06",
    title: "Выгорание и потеря сил",
    text: "Когда привычка быть сильной для всех оставляет всё меньше места для собственной жизни.",
  },
];

const methods = [
  {
    label: "Система внутренней семьи",
    title: "IFS",
    text: "Помогает услышать разные части личности, снизить внутреннюю борьбу и вернуть управление спокойному, целостному «Я».",
  },
  {
    label: "Переработка движением глаз",
    title: "EMDR",
    text: "Помогает мозгу переработать тяжёлый опыт, чтобы воспоминания перестали управлять реакциями в настоящем.",
  },
  {
    label: "Трансформация образов",
    title: "ImTT",
    text: "Бережная работа с эмоциональной болью через образы — без необходимости снова подробно проживать травму.",
  },
];

const steps = [
  ["01", "Знакомимся", "Вы рассказываете, что происходит. Я помогаю сформулировать запрос и понять, подходим ли мы друг другу."],
  ["02", "Определяем маршрут", "Выбираем направление и темп работы. Никаких универсальных схем — процесс строится вокруг вас."],
  ["03", "Возвращаем опору", "Шаг за шагом меняем старые реакции и переносим новые способы справляться в повседневную жизнь."],
];

const resources = [
  ["Тест", "Уровень тревоги", "Понять, насколько тревога влияет на повседневную жизнь"],
  ["Чек-лист", "Признаки выгорания", "Проверить состояние и заметить сигналы перегрузки"],
  ["Статья", "Почему я злюсь?", "Разобраться, какую потребность защищает ваша злость"],
];

const faqs = [
  ["Как понять, что мне нужна помощь психолога?", "Если тревога, усталость, самокритика или повторяющиеся ситуации заметно мешают жить — этого уже достаточно, чтобы прийти. Не нужно ждать кризиса или заранее уметь точно сформулировать запрос."],
  ["Как проходит первая сессия?", "Встреча длится около 50 минут. Мы знакомимся, обсуждаем, что беспокоит вас сейчас, и определяем возможное направление работы. Вы не обязаны рассказывать больше, чем готовы."],
  ["Сколько встреч потребуется?", "Это зависит от запроса, глубины переживаний и желаемых изменений. Иногда несколько встреч дают нужную ясность, для устойчивой глубокой работы требуется больше времени."],
  ["Можно ли заниматься онлайн?", "Да. Основной формат практики — онлайн-сессии, доступные из любой страны. Важно только тихое личное пространство и стабильная связь."],
];

export default function Home() {
  return (
    <main>
      <div className="availability-bar">
        <span>Онлайн-сессии · Санкт-Петербург</span>
        <a href="#contact">Записаться на знакомство</a>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Валерия Фридлендер — главная">
          <span>Валерия</span>
          <strong>Фридлендер</strong>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#directions">Направления</a>
          <a href="#approach">Подход</a>
          <a href="#about">Обо мне</a>
          <a href="#resources">Материалы</a>
        </nav>
        <a className="header-cta" href="#contact">
          Начать работу <span aria-hidden="true">→</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Психолог для тех, кто привык справляться</p>
          <h1>
            Вернуться к себе —
            <em> спокойно и без оценок.</em>
          </h1>
          <p className="hero-lead">
            Помогаю прожить тревогу, травматический опыт и внутренние конфликты,
            чтобы снова почувствовать опору и свободу выбирать свою жизнь.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              Записаться на консультацию
            </a>
            <a className="text-link" href="#directions">
              С чем я работаю <span aria-hidden="true">↘</span>
            </a>
          </div>
          <p className="hero-note">Первая встреча — знакомство и определение направления работы.</p>
        </div>

        <div className="hero-visual" aria-label="Психолог Валерия Фридлендер">
          <div className="hero-monogram" aria-hidden="true">VF</div>
          <img
            src="/images/hero-valeria.webp"
            alt="Психолог Валерия Фридлендер"
            width="1680"
            height="1365"
            fetchPriority="high"
          />
          <div className="hero-caption">
            <span>Валерия Фридлендер</span>
            <small>Практический психолог</small>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="О практике">
        {trustPoints.map((item, index) => (
          <article key={item.title}>
            <span className="trust-index">0{index + 1}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="intro-section section-shell" id="directions">
        <div className="section-kicker">Направления работы</div>
        <div className="intro-heading">
          <h2>Можно перестать справляться в одиночку.</h2>
          <p>
            Терапия начинается не с диагноза, а с честного разговора о том, как вам сейчас.
            Выберите тему, которая отзывается — каждая станет отдельным подробным маршрутом на сайте.
          </p>
        </div>
        <div className="direction-grid">
          {directions.map((item) => (
            <a className="direction-card" href="#contact" key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <strong aria-hidden="true">Подробнее ↗</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="statement-section">
        <p>Вам не нужно становиться другим человеком.</p>
        <h2>Важно снова услышать себя — без шума чужих ожиданий.</h2>
      </section>

      <section className="about-section section-shell" id="about">
        <div className="about-image-wrap">
          <img
            src="/images/tild6461-6666-4637-b236-366364393738__img_7708.jpg"
            alt="Валерия Фридлендер"
            width="1680"
            height="2240"
            loading="lazy"
          />
          <div className="about-image-note">Санкт-Петербург · онлайн по всему миру</div>
        </div>
        <div className="about-copy">
          <div className="section-kicker">Обо мне</div>
          <h2>Привет, я Валерия.</h2>
          <p className="about-lead">
            Я практический психолог. Уже пять лет помогаю людям превращать растерянность
            в понимание, а страх — в движение вперёд.
          </p>
          <p>
            В моём пространстве не нужно быть сильной, идеальной или удобной. Здесь можно
            остановиться, снять привычную маску и услышать, что на самом деле важно именно вам.
          </p>
          <div className="about-facts">
            <div><strong>1 584+</strong><span>часа профессионального обучения</span></div>
            <div><strong>1 008+</strong><span>проведённых сессий</span></div>
          </div>
          <a className="button button-dark" href="#approach">Узнать о моём подходе</a>
        </div>
      </section>

      <section className="methods-section section-shell" id="approach">
        <div className="methods-head">
          <div>
            <div className="section-kicker section-kicker-light">Методы</div>
            <h2>Бережно к чувствам.<br />Точно к причине.</h2>
          </div>
          <p>
            Я соединяю несколько подходов, чтобы работа соответствовала вашему опыту,
            а не заставляла вас соответствовать заранее выбранной методике.
          </p>
        </div>
        <div className="methods-grid">
          {methods.map((method) => (
            <article className="method-card" key={method.title}>
              <span>{method.label}</span>
              <h3>{method.title}</h3>
              <p>{method.text}</p>
              <a href="#contact">Как проходит работа →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section section-shell">
        <div className="process-intro">
          <div className="section-kicker">Как начать</div>
          <h2>Путь к себе начинается с одной встречи.</h2>
        </div>
        <div className="steps-list">
          {steps.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="formats-section section-shell">
        <div className="formats-copy">
          <div className="section-kicker section-kicker-light">Форматы работы</div>
          <h2>Поддержка в том объёме, который нужен сейчас.</h2>
          <p>Формат и количество встреч определяем вместе после знакомства.</p>
        </div>
        <div className="format-list">
          <article><span>01</span><div><h3>Индивидуальная сессия</h3><p>50 минут · онлайн</p></div><strong>10 000 ₽</strong></article>
          <article><span>02</span><div><h3>Фокус</h3><p>3 встречи для работы с конкретной целью</p></div><strong>24 000 ₽</strong></article>
          <article><span>03</span><div><h3>Гармония</h3><p>5 встреч для более глубокой проработки</p></div><strong>35 000 ₽</strong></article>
          <article><span>04</span><div><h3>Малая группа</h3><p>До пяти участников</p></div><strong>от 5 000 ₽</strong></article>
        </div>
      </section>

      <section className="resources-section section-shell" id="resources">
        <div className="resources-head">
          <div>
            <div className="section-kicker">Материалы</div>
            <h2>Начать можно самостоятельно.</h2>
          </div>
          <p>Тесты, короткие разборы и практические материалы, которые помогают лучше понять своё состояние.</p>
        </div>
        <div className="resource-grid">
          {resources.map(([type, title, text], index) => (
            <a href="#contact" className={`resource-card resource-card-${index + 1}`} key={title}>
              <span>{type}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <strong aria-hidden="true">Открыть ↗</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="faq-section section-shell">
        <div className="faq-heading">
          <div className="section-kicker">Вопросы</div>
          <h2>До первой встречи</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary><span>{question}</span><i aria-hidden="true">+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <span>Готовы начать?</span>
          <h2>Давайте найдём точку, с которой станет легче двигаться.</h2>
          <p>Напишите Валерии в удобном мессенджере — коротко расскажите, что беспокоит, и мы подберём время.</p>
          <div>
            <a className="button button-primary" href="https://t.me/Valeria_Fridlender">Написать в Telegram</a>
            <a className="contact-link" href="https://wa.me/79111284444">WhatsApp ↗</a>
          </div>
        </div>
        <div className="contact-portrait">
          <img
            src="/images/tild3236-3363-4432-a238-353234313366__img_7710.jpg"
            alt="Валерия Фридлендер в рабочем кабинете"
            width="1680"
            height="2240"
            loading="lazy"
          />
        </div>
      </section>

      <footer>
        <div className="footer-brand"><span>Валерия</span><strong>Фридлендер</strong></div>
        <p>Практический психолог · Санкт-Петербург · онлайн</p>
        <div><a href="https://t.me/Valeria_Fridlender">Telegram</a><a href="https://vk.com/lerapsy">VKontakte</a><a href="mailto:valeryafridlender@gmail.com">Email</a></div>
        <small>© 2026 · Политика конфиденциальности</small>
      </footer>
    </main>
  );
}
