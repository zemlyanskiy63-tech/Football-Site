// Каталог индексируется на клиенте: поиск работает без сервера и библиотек.
const searchData = [
  { title: "Главная — футбольная академия Алатау", type: "Страница", url: "index.html" },
  { title: "О нас — история, миссия и тренеры", type: "Страница", url: "about.html" },
  { title: "Академия — расписание, цены и методика", type: "Страница", url: "academy.html" },
  { title: "Команды — составы, тренеры и достижения", type: "Страница", url: "teams.html" },
  { title: "Новости — матчи и турниры", type: "Страница", url: "news.html" },
  { title: "Галерея — фотографии тренировок и матчей", type: "Страница", url: "gallery.html" },
  { title: "Контакты — адрес и запись на тренировку", type: "Страница", url: "contacts.html" },
  { title: "Алатау U-8 — команда 6–8 лет", type: "Команда", url: "teams.html" },
  { title: "Алатау U-11 — команда 9–11 лет", type: "Команда", url: "teams.html" },
  { title: "Алатау U-14 — команда 12–14 лет", type: "Команда", url: "teams.html" },
  { title: "Алатау U-17 — команда 15–17 лет", type: "Команда", url: "teams.html" },
  { title: "Алатау қыздары — девичья команда", type: "Команда", url: "teams.html" },
  { title: "Ерлан Сеитов — главный тренер академии", type: "Тренер", url: "about.html" },
  { title: "Марат Ибраев — тренер команды U-14", type: "Тренер", url: "about.html" },
  { title: "Алия Нурланова — тренер по физической подготовке", type: "Тренер", url: "about.html" },
  { title: "Весенний кубок Алматы — победа команды U-14", type: "Новость", url: "news.html#final" },
  { title: "Летний футбольный интенсив — открыта запись", type: "Новость", url: "news.html#camp" },
  { title: "Первый круг команды U-14", type: "Новость", url: "news.html#match" },
  { title: "Тренировки для детей от 6 до 17 лет", type: "Программа", url: "academy.html" },
  { title: "Пробная тренировка бесплатно", type: "Запись", url: "contacts.html#request" }
];

(() => {
  const input = document.querySelector("#site-search");
  const results = document.querySelector("#search-results");
  if (!input || !results) return;

  const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);

  const highlight = (value, query) => {
    const escaped = escapeHtml(value);
    const safeQuery = escapeHtml(query);
    const matchIndex = value.toLocaleLowerCase("ru").indexOf(query.toLocaleLowerCase("ru"));
    if (matchIndex < 0) return escaped;
    return `${escapeHtml(value.slice(0, matchIndex))}<mark>${escapeHtml(value.slice(matchIndex, matchIndex + query.length))}</mark>${escapeHtml(value.slice(matchIndex + query.length))}`;
  };

  const closeResults = () => {
    results.classList.remove("is-open");
    results.replaceChildren();
    input.setAttribute("aria-expanded", "false");
  };

  const showResults = () => {
    const query = input.value.trim();
    if (query.length < 2) {
      closeResults();
      return;
    }
    const matches = searchData.filter((item) =>
      `${item.title} ${item.type}`.toLocaleLowerCase("ru").includes(query.toLocaleLowerCase("ru"))
    ).slice(0, 7);
    results.innerHTML = matches.length
      ? matches.map((item) => `<a class="search-result" role="option" href="${item.url}">${highlight(item.title, query)}<small>${escapeHtml(item.type)}</small></a>`).join("")
      : '<div class="search-empty">Ничего не найдено. Попробуйте другой запрос.</div>';
    results.classList.add("is-open");
    input.setAttribute("aria-expanded", "true");
  };

  input.setAttribute("aria-expanded", "false");
  input.addEventListener("input", showResults);
  input.addEventListener("focus", showResults);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeResults();
    if (event.key === "ArrowDown" && results.querySelector("a")) {
      event.preventDefault();
      results.querySelector("a").focus();
    }
  });
  results.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeResults();
      input.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-search")) closeResults();
  });
})();
