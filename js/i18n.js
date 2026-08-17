/**
 * Lightweight EN/FR language switcher.
 *
 * English is authored directly in the HTML and is captured automatically
 * the first time each [data-i18n] element is seen (no need to duplicate
 * English strings in this file). Only French strings need to be listed in
 * FR_DICT below, keyed by the same string used in data-i18n="...".
 *
 * Supported attributes:
 *  - data-i18n="key"              -> swaps el.textContent
 *  - data-i18n-html="key"         -> swaps el.innerHTML (for text with inline tags)
 *  - data-i18n-placeholder="key"  -> swaps el.placeholder (form fields)
 *  - data-i18n-aria="key"         -> swaps el.getAttribute('aria-label')
 *  - <body data-title-en="..." data-title-fr="..."> -> swaps document.title
 */
(function () {
  var STORAGE_KEY = "emanueli_lang";
  var cache = new WeakMap();

  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }
  window.getCurrentLang = getCurrentLang;

  function dict(key) {
    return window.FR_DICT && Object.prototype.hasOwnProperty.call(window.FR_DICT, key)
      ? window.FR_DICT[key]
      : null;
  }

  function captureAndApply(el, mode, lang) {
    if (!cache.has(el)) {
      var original =
        mode === "html"
          ? el.innerHTML
          : mode === "placeholder"
          ? el.placeholder
          : mode === "aria"
          ? el.getAttribute("aria-label")
          : el.textContent;
      cache.set(el, original);
    }
    var original = cache.get(el);
    var key = el.getAttribute(
      mode === "html"
        ? "data-i18n-html"
        : mode === "placeholder"
        ? "data-i18n-placeholder"
        : mode === "aria"
        ? "data-i18n-aria"
        : "data-i18n"
    );
    var value = lang === "fr" ? dict(key) || original : original;

    if (mode === "html") el.innerHTML = value;
    else if (mode === "placeholder") el.placeholder = value;
    else if (mode === "aria") el.setAttribute("aria-label", value);
    else el.textContent = value;
  }

  function apply() {
    var lang = getCurrentLang();
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      captureAndApply(el, "text", lang);
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      captureAndApply(el, "html", lang);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      captureAndApply(el, "placeholder", lang);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      captureAndApply(el, "aria", lang);
    });

    var body = document.body;
    if (body && body.dataset.titleEn) {
      document.title = lang === "fr" && body.dataset.titleFr ? body.dataset.titleFr : body.dataset.titleEn;
    }

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    if (typeof window.onLanguageApplied === "function") window.onLanguageApplied(lang);
  }
  window.i18nApply = apply;

  function setLanguage(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    apply();
  }
  window.setLanguage = setLanguage;

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-lang]");
    if (!btn) return;
    setLanguage(btn.getAttribute("data-lang"));
  });

  document.addEventListener("DOMContentLoaded", apply);
})();
