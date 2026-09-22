"use client";

import { FormEvent, type RefObject, useEffect, useRef, useState } from "react";

export type LeadFormKey =
  | "header-start"
  | "hero-consultation"
  | "discuss-request"
  | "individual-therapy"
  | "trauma-experience"
  | "self-relationship"
  | "relationships"
  | "first-session"
  | "about-meeting"
  | "diagnostic"
  | "single-session"
  | "three-sessions"
  | "five-sessions"
  | "contact"
  | "footer-start"
  | "method-ifs"
  | "method-emdr"
  | "method-imtt";

export type MethodKey = "ifs" | "emdr" | "imtt";

export type ServiceKey =
  | "individual-therapy"
  | "trauma-experience"
  | "self-relationship"
  | "relationships";

type LeadContent = {
  eyebrow: string;
  title: string;
  intro: string;
  signs?: string[];
  work: string;
  note: string;
  messagePlaceholder?: string;
};

export const leadContent: Record<LeadFormKey, LeadContent> = {
  "header-start": {
    eyebrow: "Начало работы",
    title: "Не обязательно заранее знать, как правильно назвать свой запрос.",
    intro: "Можно начать с ситуации, которая повторяется, беспокоит или отнимает слишком много сил.",
    work: "Валерия уточнит детали и предложит время для первой встречи. Решение о продолжении вы примете после неё.",
    note: "Ответит лично. Обычно для первого сообщения достаточно нескольких предложений.",
  },
  "hero-consultation": {
    eyebrow: "Консультация",
    title: "Первая встреча нужна, чтобы увидеть задачу яснее.",
    intro: "На ней не нужно производить правильное впечатление или доказывать, что вам действительно трудно.",
    work: "Вы расскажете, что происходит сейчас. Валерия задаст вопросы и объяснит, с чем можно работать и какой формат может подойти.",
    note: "60 минут · онлайн или очно в Санкт-Петербурге.",
  },
  "discuss-request": {
    eyebrow: "Обсудить запрос",
    title: "Понимание проблемы ещё не всегда меняет привычный сценарий.",
    intro: "Если объяснения уже есть, а реакции, решения или отношения остаются прежними, это можно исследовать в работе.",
    work: "Опишите, где именно вы замечаете повторение. Формулировка может быть неточной — её можно собрать вместе на первой встрече.",
    note: "Без универсальных рецептов и обещаний быстрых изменений.",
  },
  "individual-therapy": {
    eyebrow: "Индивидуальная терапия",
    title: "Когда вы справляетесь — но на это уходит слишком много сил.",
    intro: "Обращение к психологу не требует кризиса, который невозможно скрыть от окружающих.",
    signs: [
      "тревога или напряжение стали привычным фоном",
      "важные решения откладываются или даются через перегрузку",
      "вы многое понимаете о себе, но снова реагируете по-старому",
    ],
    work: "В терапии мы ищем не удобное объяснение, а то, что действительно поддерживает состояние. Затем выстраиваем способ действовать иначе — без войны с собой.",
    note: "Запрос можно уточнить уже в процессе. Достаточно описать, что происходит сейчас.",
  },
  "trauma-experience": {
    eyebrow: "Травматический опыт",
    title: "Событие могло закончиться. Реакция на него — остаться.",
    intro: "Иногда прошлое проявляется не воспоминанием, а телесным напряжением, избеганием, стыдом или ощущением опасности там, где её уже нет.",
    signs: [
      "отдельные ситуации вызывают непропорционально сильную реакцию",
      "трудно расслабиться, доверять или чувствовать себя в безопасности",
      "вы избегаете темы, но она всё равно влияет на решения и отношения",
    ],
    work: "В работе используются EMDR и ImTT. Подробно пересказывать пережитое не всегда требуется: темп и способ работы определяются по вашему состоянию.",
    note: "Валерия не будет торопить вас туда, к чему вы пока не готовы.",
  },
  "self-relationship": {
    eyebrow: "Отношения с собой",
    title: "Иногда внутренний критик говорит вашим голосом — но не действует в ваших интересах.",
    intro: "Самокритика может выглядеть как дисциплина, а отказ от собственных потребностей — как зрелость и ответственность.",
    signs: [
      "отдых сопровождается виной, а ошибка — стыдом",
      "собственную ценность приходится подтверждать результатами или одобрением",
      "вы хорошо поддерживаете других, но не знаете, чего хотите сами",
    ],
    work: "Мы разбираемся, какие внутренние части защищают привычный порядок и чего они опасаются. Цель — не убедить себя, что всё прекрасно, а вернуть контакт с собой и ответственность за выбор.",
    note: "Без лозунга «просто полюбите себя» и без обесценивания реальных обстоятельств.",
  },
  relationships: {
    eyebrow: "Отношения с другими",
    title: "Если меняются люди, а сценарий остаётся, дело может быть не в случайности.",
    intro: "Знакомая роль возвращается в новых отношениях: снова трудно просить, отказывать, выдерживать близость или не угадывать чужие ожидания.",
    signs: [
      "разговор о потребностях откладывается до обиды или дистанции",
      "границы ощущаются как угроза отношениям",
      "забота, контроль и страх потери начинают путаться между собой",
    ],
    work: "В терапии можно увидеть, как устроен повторяющийся сценарий, какую функцию он выполняет и что потребуется, чтобы действовать прямее — не разрушая себя и не назначая другого ответственным за всё.",
    note: "Работа не сводится к поиску виноватого или совету немедленно уйти либо остаться.",
  },
  "first-session": {
    eyebrow: "Первая сессия",
    title: "Можно прийти без правильных слов.",
    intro: "Первая встреча — это не экзамен на осознанность и не обязательство начинать длительную терапию.",
    work: "Вы описываете ситуацию, Валерия уточняет контекст и помогает сформулировать рабочую задачу. В конце вы обсуждаете возможный формат и решаете, продолжать ли работу.",
    note: "60 минут · 10 000 ₽.",
  },
  "about-meeting": {
    eyebrow: "Встреча с психологом",
    title: "До начала работы важно понять, подходит ли вам специалист.",
    intro: "Методы и опыт имеют значение, но рабочий контакт нельзя определить только по описанию на сайте.",
    work: "На первой встрече можно задать вопросы о подходе, обсудить границы работы и проверить, насколько вам понятен и подходит этот способ разговора.",
    note: "После встречи вы свободно решаете, продолжать ли терапию.",
  },
  diagnostic: {
    eyebrow: "Диагностика · 30 минут",
    title: "Короткая встреча, чтобы разобрать ситуацию и следующий шаг.",
    intro: "Подходит, если вы пока не уверены, нужна ли терапия и с какого запроса начинать.",
    work: "За 30 минут можно обозначить контекст, выделить основную задачу и понять, какой формат работы имеет смысл рассматривать дальше.",
    note: "Стоимость: 0 ₽.",
  },
  "single-session": {
    eyebrow: "Одна сессия · 60 минут",
    title: "Одна встреча — не обещание решить всё, но возможность сделать ситуацию яснее.",
    intro: "Формат подходит для первого знакомства, конкретного вопроса или начала работы с запросом.",
    work: "На встрече вы определите задачу, разберёте контекст и возможные направления дальнейшей работы.",
    note: "Стоимость: 10 000 ₽.",
  },
  "three-sessions": {
    eyebrow: "Пакет · 3 сессии",
    title: "Три встречи дают пространство не только увидеть сценарий, но и начать его исследовать.",
    intro: "Подходит для последовательной работы с конкретным запросом без решения о длинном формате заранее.",
    work: "После первой встречи вы уточните план и ориентиры, по которым можно отслеживать изменения.",
    note: "3 × 60 минут · 24 000 ₽.",
  },
  "five-sessions": {
    eyebrow: "Пакет · 5 сессий",
    title: "Формат для более последовательной работы с повторяющейся реакцией или сценарием.",
    intro: "Пять встреч позволяют удерживать общий фокус и замечать изменения не только на сессии, но и между ними.",
    work: "План остаётся гибким: методы и темп корректируются по вашему состоянию и тому, что происходит в процессе.",
    note: "5 × 60 минут · 35 000 ₽.",
  },
  contact: {
    eyebrow: "Запись на сессию",
    title: "Опишите ситуацию так, как получается сейчас.",
    intro: "Для первого сообщения не нужна история всей жизни или окончательная формулировка запроса.",
    work: "Валерия прочитает сообщение лично, ответит на вопросы и предложит доступное время для встречи.",
    note: "Контакт используется только для ответа на вашу заявку.",
  },
  "footer-start": {
    eyebrow: "Начать работу",
    title: "Первый шаг — коротко описать, что вы хотите изменить.",
    intro: "Если пока сложно выбрать направление, это нормально: запрос можно уточнить в диалоге.",
    work: "Оставьте удобный контакт. Валерия ответит лично и предложит следующий шаг.",
    note: "Конфиденциально · без автоматических рассылок.",
  },
  "method-ifs": {
    eyebrow: "IFS · обсудить задачу",
    title: "Метод не выбирают по названию — сначала важно понять, что происходит.",
    intro: "Если вам откликнулось описание внутренних частей, можно кратко рассказать о своём запросе.",
    work: "Валерия уточнит контекст и скажет, имеет ли смысл рассматривать IFS или другой способ работы.",
    note: "Окончательный выбор метода происходит после знакомства с задачей и вашим состоянием.",
  },
  "method-emdr": {
    eyebrow: "EMDR · обсудить задачу",
    title: "Сначала — безопасность и готовность, затем техника.",
    intro: "Опишите, какая реакция или воспоминание мешает вам сейчас. Подробный пересказ травматичного события не нужен.",
    work: "Валерия оценит, подходит ли EMDR для этой задачи и какой подготовительный этап может понадобиться.",
    note: "Метод не применяется автоматически только потому, что опыт кажется травматичным.",
  },
  "method-imtt": {
    eyebrow: "ImTT · обсудить задачу",
    title: "Работать с эмоциональной болью можно без повторного погружения в историю.",
    intro: "Если переживание трудно пересказывать или оно связано со стыдом и виной, можно начать с нескольких общих слов.",
    work: "Валерия уточнит задачу и объяснит, подходит ли работа с образами в вашем случае.",
    note: "Темп определяется не техникой, а тем, насколько устойчиво вы чувствуете себя в процессе.",
  },
};

const methodContent: Record<MethodKey, { short: string; title: string; subtitle: string; lead: string; points: string[]; boundary: string; formKey: LeadFormKey }> = {
  ifs: {
    short: "IFS",
    title: "Система внутренней семьи",
    subtitle: "Работа с внутренними частями",
    lead: "IFS помогает увидеть внутренний конфликт не как поломку характера, а как взаимодействие частей, каждая из которых когда-то научилась защищать вас своим способом.",
    points: ["когда одна часть требует действовать, а другая останавливает", "когда критика, контроль или избегание включаются автоматически", "когда понимание причины не меняет привычную реакцию"],
    boundary: "Задача не в том, чтобы избавиться от неудобной части, а в том, чтобы понять её функцию и вернуть себе больше выбора.",
    formKey: "method-ifs",
  },
  emdr: {
    short: "EMDR",
    title: "Переработка травматического опыта",
    subtitle: "Работа с застрявшей реакцией",
    lead: "EMDR применяется, когда событие завершилось, но нервная система продолжает реагировать так, будто опасность всё ещё рядом.",
    points: ["навязчивые воспоминания или телесные реакции", "избегание ситуаций, напоминающих о пережитом", "устойчивые убеждения о себе, возникшие после события"],
    boundary: "Работа начинается не с интенсивного погружения, а с оценки состояния, ресурсов и готовности к переработке.",
    formKey: "method-emdr",
  },
  imtt: {
    short: "ImTT",
    title: "Трансформация образов",
    subtitle: "Работа без подробного пересказа",
    lead: "ImTT позволяет работать с образами и эмоциональной болью, не заставляя человека снова подробно воспроизводить травматичную историю.",
    points: ["стыд, вина и переживания, о которых трудно говорить", "образ себя, сложившийся после болезненного опыта", "реакции, которые ощущаются телом сильнее, чем объясняются словами"],
    boundary: "Метод выбирается после уточнения запроса и не заменяет бережной оценки того, что сейчас выдерживает психика.",
    formKey: "method-imtt",
  },
};

function readTracking() {
  if (typeof window === "undefined") return {} as Record<string, string>;
  const params = new URLSearchParams(window.location.search);
  const fields = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid", "gclid"];
  const values: Record<string, string> = {
    source_url: window.location.href,
    referrer: document.referrer,
  };
  fields.forEach((field) => {
    const value = params.get(field);
    if (value) values[field] = value;
  });
  const metrikaId = document.cookie.match(/(?:^|;\s*)_ym_uid=([^;]+)/)?.[1];
  if (metrikaId) values.ym_client_id = decodeURIComponent(metrikaId);
  return values;
}

function useLockedPageScroll(onClose: () => void, closeButton: RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const previous = {
      rootOverflow: root.style.overflow,
      rootOverscroll: root.style.overscrollBehavior,
      rootScrollBehavior: root.style.scrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
    };

    root.classList.add("page-locked");
    body.classList.add("page-locked");
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    root.style.scrollBehavior = "auto";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      root.classList.remove("page-locked");
      body.classList.remove("page-locked");
      root.style.overflow = previous.rootOverflow;
      root.style.overscrollBehavior = previous.rootOverscroll;
      body.style.overflow = previous.bodyOverflow;
      body.style.overscrollBehavior = previous.bodyOverscroll;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.width = previous.bodyWidth;
      body.style.paddingRight = previous.bodyPaddingRight;
      window.scrollTo(0, scrollY);
      root.style.scrollBehavior = previous.rootScrollBehavior;
    };
  }, [closeButton, onClose]);
}

export function LeadForm({ formKey, compact = false }: { formKey: LeadFormKey; compact?: boolean }) {
  const content = leadContent[formKey];
  const [token, setToken] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const endpoint = new URL("api/form-token.php", window.location.href);
    endpoint.searchParams.set("form", formKey);
    fetch(endpoint.href, {
      credentials: "same-origin",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload && typeof payload.token === "string") setToken(payload.token);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [formKey]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      return;
    }
    Object.entries(readTracking()).forEach(([name, value]) => {
      let input = form.elements.namedItem(name) as HTMLInputElement | null;
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        form.appendChild(input);
      }
      input.value = value;
    });
  };

  return (
    <form className={`lead-form${compact ? " lead-form-compact" : ""}`} action="api/lead-request.php" method="post" onSubmit={handleSubmit}>
      <input type="hidden" name="form_key" value={formKey} />
      <input type="hidden" name="form_token" value={token} />
      <div className="lead-honeypot" aria-hidden="true">
        <label>Ваш сайт<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="lead-field">
        <span>Как к вам обращаться</span>
        <input name="name" type="text" autoComplete="name" maxLength={80} required placeholder="Имя" />
      </label>
      <label className="lead-field">
        <span>Куда ответить</span>
        <input name="contact" type="text" autoComplete="email" maxLength={160} required placeholder="Телефон, Telegram или email" />
      </label>
      <label className="lead-field">
        <span>Что происходит</span>
        <textarea name="message" rows={compact ? 3 : 4} maxLength={1600} placeholder={content.messagePlaceholder || "Можно написать несколько предложений. Подробности — только если вам комфортно."} />
      </label>
      <label className="lead-consent">
        <input type="checkbox" name="consent" value="yes" required />
        <span>Я соглашаюсь с <a href="personal-data-consent.html" target="_blank">обработкой персональных данных</a> и <a href="privacy-policy.html" target="_blank">политикой конфиденциальности</a>.</span>
      </label>
      <button className="lead-submit" type="submit">Отправить Валерии <span aria-hidden="true">⟶</span></button>
      <p className="lead-form-note">Валерия ответит лично. Данные не используются для рассылок.</p>
    </form>
  );
}

export function LeadModal({ formKey, onClose }: { formKey: LeadFormKey; onClose: () => void }) {
  const content = leadContent[formKey];
  const closeButton = useRef<HTMLButtonElement>(null);
  useLockedPageScroll(onClose, closeButton);

  return (
    <div className="lead-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="lead-dialog" role="dialog" aria-modal="true" aria-labelledby={`lead-title-${formKey}`}>
        <button ref={closeButton} className="lead-close" type="button" onClick={onClose} aria-label="Закрыть форму">×</button>
        <div className="lead-dialog-form">
          <p className="lead-form-kicker">{content.eyebrow}</p>
          <h2 id={`lead-title-${formKey}`}>Написать Валерии</h2>
          <p>Оставьте удобный контакт и несколько слов о ситуации. Запрос можно уточнить позже.</p>
          <LeadForm formKey={formKey} compact />
        </div>
      </section>
    </div>
  );
}

export function ServiceModal({ serviceKey, onClose, onContact }: { serviceKey: ServiceKey; onClose: () => void; onContact: (formKey: LeadFormKey) => void }) {
  const content = leadContent[serviceKey];
  const closeButton = useRef<HTMLButtonElement>(null);
  useLockedPageScroll(onClose, closeButton);

  return (
    <div className="service-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="service-dialog" role="dialog" aria-modal="true" aria-labelledby={`service-title-${serviceKey}`}>
        <button ref={closeButton} className="service-close" type="button" onClick={onClose} aria-label="Закрыть описание">×</button>
        <p className="eyebrow">{content.eyebrow}</p>
        <h2 id={`service-title-${serviceKey}`}>{content.title}</h2>
        <p className="service-intro">{content.intro}</p>
        {content.signs && (
          <ul className="service-signs">{content.signs.map((sign) => <li key={sign}>{sign}</li>)}</ul>
        )}
        <p className="service-work">{content.work}</p>
        <div className="service-footer">
          <p>{content.note}</p>
          <button type="button" onClick={() => onContact(serviceKey)}>Обсудить запрос <span aria-hidden="true">→</span></button>
        </div>
      </section>
    </div>
  );
}

export function MethodDrawer({ methodKey, onClose, onDiscuss }: { methodKey: MethodKey; onClose: () => void; onDiscuss: (formKey: LeadFormKey) => void }) {
  const content = methodContent[methodKey];
  const closeButton = useRef<HTMLButtonElement>(null);
  useLockedPageScroll(onClose, closeButton);

  return (
    <div className="method-drawer-shell" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="method-drawer" role="dialog" aria-modal="true" aria-labelledby={`method-title-${methodKey}`}>
        <div className="method-orbit" aria-hidden="true"><span>{content.short}</span></div>
        <button ref={closeButton} className="method-close" type="button" onClick={onClose} aria-label="Закрыть описание метода">×</button>
        <div className="method-drawer-content">
          <p className="eyebrow">Метод работы · {content.short}</p>
          <h2 id={`method-title-${methodKey}`}>{content.title}</h2>
          <p className="method-subtitle">{content.subtitle}</p>
          <p className="method-lead">{content.lead}</p>
          <div className="method-points">
            <small>Метод может использоваться:</small>
            <ul>{content.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>
          <p className="method-boundary">{content.boundary}</p>
          <button className="method-discuss" type="button" onClick={() => onDiscuss(content.formKey)}>Обсудить свою задачу <span aria-hidden="true">⟶</span></button>
          <p className="method-caption">Метод всегда подбирается под задачу, а не наоборот.</p>
        </div>
      </aside>
    </div>
  );
}
