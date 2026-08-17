(function () {
  var pairs = [
    { id: "editorial", name: "Редакционный", note: "Текущий вариант — ближе всего к референсу", display: '"Cormorant Garamond", Georgia, serif', body: '"Montserrat", Arial, sans-serif' },
    { id: "soft", name: "Мягкий экспертный", note: "Больше тепла, меньше журнальной строгости", display: '"Lora", Georgia, serif', body: '"Manrope", Arial, sans-serif' },
    { id: "status", name: "Статусный", note: "Сдержанный, дорогой и очень собранный", display: '"Prata", Georgia, serif', body: '"Manrope", Arial, sans-serif' },
    { id: "warm", name: "Тёплый человеческий", note: "Живее и ближе, хорошо для длинных текстов", display: '"Vollkorn", Georgia, serif', body: '"Inter", Arial, sans-serif' },
    { id: "air", name: "Воздушный", note: "Лёгкий характер и выраженная индивидуальность", display: '"Forum", Georgia, serif', body: '"Montserrat", Arial, sans-serif' }
  ];

  var lab = document.querySelector(".font-lab");
  if (!lab) return;
  var trigger = lab.querySelector(".font-lab-trigger");
  var selected = localStorage.getItem("valeria-font-pair") || "editorial";

  function apply(pair) {
    document.documentElement.style.setProperty("--font-display", pair.display);
    document.documentElement.style.setProperty("--font-body", pair.body);
  }

  function panelHtml() {
    return '<div class="font-lab-panel"><div class="font-lab-head"><div><small>Настройка дизайна</small><h2>Примерочная шрифтов</h2></div><button type="button" aria-label="Закрыть примерочную">×</button></div><p class="font-lab-lead">Выберите пару — она сразу применится ко всему сайту.</p><div class="font-lab-options">' + pairs.map(function (pair) {
      var active = pair.id === selected;
      return '<button class="' + (active ? 'is-selected' : '') + '" type="button" data-font="' + pair.id + '" aria-pressed="' + active + '"><span class="font-option-top"><b>' + pair.name + '</b><i>' + (active ? 'Выбран' : 'Попробовать') + '</i></span><strong style="font-family:' + pair.display.replace(/"/g, '&quot;') + '">Спокойная и своя жизнь</strong><span style="font-family:' + pair.body.replace(/"/g, '&quot;') + '">Уверенная подача и чистый ритм</span><small>' + pair.note + '</small></button>';
    }).join("") + '</div></div>';
  }

  function close() {
    var panel = lab.querySelector(".font-lab-panel");
    if (panel) panel.remove();
    lab.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  trigger.addEventListener("click", function () {
    if (lab.classList.contains("is-open")) return close();
    lab.insertAdjacentHTML("afterbegin", panelHtml());
    lab.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
  });

  lab.addEventListener("click", function (event) {
    if (event.target.closest(".font-lab-head > button")) return close();
    var button = event.target.closest("[data-font]");
    if (!button) return;
    var pair = pairs.find(function (item) { return item.id === button.dataset.font; });
    if (!pair) return;
    selected = pair.id;
    apply(pair);
    localStorage.setItem("valeria-font-pair", pair.id);
    var panel = lab.querySelector(".font-lab-panel");
    if (panel) panel.outerHTML = panelHtml();
  });

  apply(pairs.find(function (item) { return item.id === selected; }) || pairs[0]);
}());
