"use client";

import { useEffect, useState } from "react";

const fontPairs = [
  {
    id: "editorial",
    name: "Редакционный",
    note: "Текущий вариант — ближе всего к референсу",
    display: '"Cormorant Garamond", Georgia, serif',
    body: '"Montserrat", Arial, sans-serif',
    sampleDisplay: "Спокойная и своя жизнь",
    sampleBody: "Тонкий контраст и уверенная подача",
  },
  {
    id: "soft",
    name: "Мягкий экспертный",
    note: "Больше тепла, меньше журнальной строгости",
    display: '"Lora", Georgia, serif',
    body: '"Manrope", Arial, sans-serif',
    sampleDisplay: "Спокойная и своя жизнь",
    sampleBody: "Мягкое чтение и современный ритм",
  },
  {
    id: "status",
    name: "Статусный",
    note: "Сдержанный, дорогой и очень собранный",
    display: '"Prata", Georgia, serif',
    body: '"Manrope", Arial, sans-serif',
    sampleDisplay: "Спокойная и своя жизнь",
    sampleBody: "Чёткая экспертность и спокойный тон",
  },
  {
    id: "warm",
    name: "Тёплый человеческий",
    note: "Живее и ближе, хорошо для длинных текстов",
    display: '"Vollkorn", Georgia, serif',
    body: '"Inter", Arial, sans-serif',
    sampleDisplay: "Спокойная и своя жизнь",
    sampleBody: "Доверительный голос и лёгкое чтение",
  },
  {
    id: "air",
    name: "Воздушный",
    note: "Лёгкий характер и выраженная индивидуальность",
    display: '"Forum", Georgia, serif',
    body: '"Montserrat", Arial, sans-serif',
    sampleDisplay: "Спокойная и своя жизнь",
    sampleBody: "Много воздуха и тонкая интонация",
  },
];

function applyFonts(pair: (typeof fontPairs)[number]) {
  document.documentElement.style.setProperty("--font-display", pair.display);
  document.documentElement.style.setProperty("--font-body", pair.body);
}

export default function FontLab() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("editorial");

  useEffect(() => {
    const saved = window.localStorage.getItem("valeria-font-pair");
    const pair = fontPairs.find((item) => item.id === saved) ?? fontPairs[0];
    setSelected(pair.id);
    applyFonts(pair);
  }, []);

  const choose = (pair: (typeof fontPairs)[number]) => {
    setSelected(pair.id);
    applyFonts(pair);
    window.localStorage.setItem("valeria-font-pair", pair.id);
  };

  return (
    <aside className={`font-lab${isOpen ? " is-open" : ""}`} aria-label="Примерочная шрифтов">
      {isOpen && (
        <div className="font-lab-panel">
          <div className="font-lab-head">
            <div><small>Настройка дизайна</small><h2>Примерочная шрифтов</h2></div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Закрыть примерочную">×</button>
          </div>
          <p className="font-lab-lead">Выберите пару — она сразу применится ко всему сайту. Выбор сохранится в этом браузере.</p>
          <div className="font-lab-options">
            {fontPairs.map((pair) => (
              <button className={selected === pair.id ? "is-selected" : ""} type="button" key={pair.id} onClick={() => choose(pair)} aria-pressed={selected === pair.id}>
                <span className="font-option-top"><b>{pair.name}</b><i>{selected === pair.id ? "Выбран" : "Попробовать"}</i></span>
                <strong style={{ fontFamily: pair.display }}>{pair.sampleDisplay}</strong>
                <span style={{ fontFamily: pair.body }}>{pair.sampleBody}</span>
                <small>{pair.note}</small>
              </button>
            ))}
          </div>
        </div>
      )}
      <button className="font-lab-trigger" type="button" onClick={() => setIsOpen((value) => !value)} aria-expanded={isOpen}>
        <span aria-hidden="true">Aa</span> Шрифты
      </button>
    </aside>
  );
}
