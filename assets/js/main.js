/* ===========================================================
   SET CIA — main.js
   - language toggle (EN / TH) using data-i18n attributes
   - mobile navigation toggle
   - active link highlight
   =========================================================== */

(function () {
  const STORAGE_KEY = "setcia-lang";
  const dict = window.SETCIA_I18N || { en: {}, th: {} };
  const supported = ["en", "th"];

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && supported.includes(saved)) return saved;
    const browser = (navigator.language || "en").slice(0, 2).toLowerCase();
    return supported.includes(browser) ? browser : "en";
  }

  function applyTranslations(lang) {
    const t = dict[lang] || dict.en;
    document.documentElement.lang = lang;

    // text content
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key] != null) el.textContent = t[key];
    });

    // placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (t[key] != null) el.setAttribute("placeholder", t[key]);
    });

    // title attributes
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (t[key] != null) el.setAttribute("title", t[key]);
    });

    // aria-labels
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (t[key] != null) el.setAttribute("aria-label", t[key]);
    });

    // update buttons in toggle
    document.querySelectorAll(".lang-toggle button").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
  }

  function setLang(lang) {
    if (!supported.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(lang);
    // Let other scripts (e.g. news-loader) re-render with the new language
    window.dispatchEvent(new CustomEvent("setcia:lang-changed", { detail: { lang } }));
  }

  // mark active nav link by filename
  function highlightActive() {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav-links a").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (!href) return;
      const isMatch = href === path || (path === "" && href.endsWith("index.html"));
      a.classList.toggle("active", isMatch);
    });
  }

  // mobile nav
  function bindNav() {
    const btn = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    if (!btn || !links) return;
    btn.addEventListener("click", () => links.classList.toggle("open"));
  }

  // bind language toggle buttons
  function bindLangToggle() {
    document.querySelectorAll(".lang-toggle button").forEach((b) => {
      b.addEventListener("click", () => setLang(b.dataset.lang));
    });
  }

  // light news filter (used on news page)
  function bindNewsFilter() {
    const buttons = document.querySelectorAll("[data-news-filter]");
    if (!buttons.length) return;
    buttons.forEach((b) => {
      b.addEventListener("click", () => {
        const filter = b.dataset.newsFilter;
        buttons.forEach((x) => x.classList.toggle("active", x === b));
        document.querySelectorAll("[data-news-item]").forEach((item) => {
          const cat = item.getAttribute("data-news-item");
          item.style.display =
            filter === "all" || filter === cat ? "" : "none";
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindNav();
    bindLangToggle();
    bindNewsFilter();
    highlightActive();
    setLang(getLang());
  });
})();
