/* Music Influence Chain — LP interactions
   - Bilingual JA/EN toggle (persisted in localStorage, shared across pages)
   - Content itself lives inline as .lang-ja / .lang-en spans (CSS hides the
     inactive language) so copy stays editable in the markup.
   - Scroll-reveal + mobile nav. */
(function () {
  var STORE_KEY = "mic-lang";
  var root = document.documentElement;

  function getLang() {
    var saved = localStorage.getItem(STORE_KEY);
    if (saved === "ja" || saved === "en") return saved;
    // Fall back to browser preference, default Japanese
    return (navigator.language || "").toLowerCase().indexOf("ja") === 0 ? "ja" : "ja";
  }

  function applyLang(lang) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    // Document title
    var t = document.body.getAttribute("data-title-" + lang);
    if (t) document.title = t;
    // Switch buttons
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang);
    });
  }

  function setLang(lang) {
    localStorage.setItem(STORE_KEY, lang);
    applyLang(lang);
  }

  // Init ASAP to avoid flash
  applyLang(getLang());

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(getLang());

    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.addEventListener("click", function () {
        setLang(b.getAttribute("data-lang"));
      });
    });

    // Scroll reveal — resilient: reveal anything already in/near the viewport
    // immediately, observe the rest, and always fall back to showing everything
    // so content can never stay permanently hidden.
    // Scroll reveal removed: content is always visible (see .reveal in CSS).
  });
})();
