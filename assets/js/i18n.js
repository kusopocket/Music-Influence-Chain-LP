/* Music Influence Chain — LP interactions
   - 6-language toggle (ja/en/zh-Hans/zh-Hant/ko/es)
   - Persisted in localStorage, shared across pages
   - Content lives inline as .lang-{code} spans
   - CSS hides inactive languages via [data-lang] selectors
   - Screenshot images swap via data-screenshot attributes */
(function () {
  var STORE_KEY = "mic-lang";
  var LANGS = ["ja", "en", "zh-Hans", "zh-Hant", "ko", "es"];
  var root = document.documentElement;

  function detectBrowserLang() {
    var nav = (navigator.language || "").toLowerCase();
    if (nav.indexOf("ja") === 0) return "ja";
    if (nav.indexOf("ko") === 0) return "ko";
    if (nav.indexOf("es") === 0) return "es";
    if (nav === "zh-tw" || nav === "zh-hant" || nav.indexOf("zh-hant") === 0) return "zh-Hant";
    if (nav.indexOf("zh") === 0) return "zh-Hans";
    if (nav.indexOf("en") === 0) return "en";
    return "en";
  }

  function getLang() {
    var saved = localStorage.getItem(STORE_KEY);
    if (saved && LANGS.indexOf(saved) !== -1) return saved;
    return detectBrowserLang();
  }

  function applyLang(lang) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang === "zh-Hans" ? "zh-Hans" : lang === "zh-Hant" ? "zh-Hant" : lang);

    var t = document.body.getAttribute("data-title-" + lang);
    if (t) document.title = t;

    var current = document.querySelector(".lang-current");
    if (current) {
      var labels = { ja: "日本語", en: "English", "zh-Hans": "简体中文", "zh-Hant": "繁體中文", ko: "한국어", es: "Español" };
      current.textContent = labels[lang] || lang;
    }

    document.querySelectorAll(".lang-dropdown button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });

    document.querySelectorAll("[data-screenshot]").forEach(function (img) {
      var base = img.getAttribute("data-screenshot");
      img.setAttribute("src", "assets/img/screenshots/" + lang + "/" + base);
    });
  }

  function setLang(lang) {
    localStorage.setItem(STORE_KEY, lang);
    applyLang(lang);
  }

  applyLang(getLang());

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(getLang());

    var toggle = document.querySelector(".lang-toggle");
    var dropdown = document.querySelector(".lang-dropdown");
    if (toggle && dropdown) {
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        dropdown.classList.toggle("open");
      });
      document.addEventListener("click", function () {
        dropdown.classList.remove("open");
      });
      dropdown.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    document.querySelectorAll(".lang-dropdown button").forEach(function (b) {
      b.addEventListener("click", function () {
        setLang(b.getAttribute("data-lang"));
        if (dropdown) dropdown.classList.remove("open");
      });
    });
  });
})();
