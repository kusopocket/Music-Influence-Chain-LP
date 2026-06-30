# LP最新仕様更新 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** LPサイトを最新のアプリ仕様に合わせて全面更新する（6言語化、告知ゾーン追加、DLC情報、スクリーンショット更新、プライバシーポリシー/利用規約更新）

**Architecture:** 静的HTML + CSS + vanilla JS。Supabase連携なし。既存のspan切替i18nパターンを6言語に拡張。ASCスクリーンショットを流用。DLC詳細ページを新規作成。

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, GitHub Pages

**App Store URL:** `https://apps.apple.com/jp/app/%E9%9F%B3%E6%A5%BD%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%84%E3%82%92%E3%83%87%E3%82%A3%E3%82%B0%E3%82%8B-roots/id6773954689`

**設計書:** `docs/superpowers/specs/2026-06-30-lp-update-design.md`

---

### Task 1: スクリーンショットをコピー

**Files:**
- Create: `assets/img/screenshots/ja/01_home.png` (+ 02_quiz.png, 03_beatles_roots.png)
- Create: `assets/img/screenshots/en/` (同上)
- Create: `assets/img/screenshots/zh-Hans/` (同上)
- Create: `assets/img/screenshots/zh-Hant/` (同上)
- Create: `assets/img/screenshots/ko/` (同上)
- Create: `assets/img/screenshots/es/` (同上)

- [ ] **Step 1: ディレクトリ作成とファイルコピー**

```bash
APP_SS="/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain/Screenshots/appstore/iphone17"
LP_SS="/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP/assets/img/screenshots"

for lang in ja en zh-Hans zh-Hant ko es; do
  mkdir -p "$LP_SS/$lang"
  cp "$APP_SS/$lang/01_home.png" "$LP_SS/$lang/"
  cp "$APP_SS/$lang/02_quiz.png" "$LP_SS/$lang/"
  cp "$APP_SS/$lang/03_beatles_roots.png" "$LP_SS/$lang/"
done
```

- [ ] **Step 2: コピー結果を確認**

```bash
find "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP/assets/img/screenshots" -type f | sort
```

Expected: 18ファイル（6言語 × 3枚）

- [ ] **Step 3: 古いスクリーンショットを削除**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
rm -f assets/img/screen-home.png assets/img/screen-quiz.png assets/img/screen-roots.png
```

- [ ] **Step 4: コミット**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
git add assets/img/screenshots/ && git rm --cached assets/img/screen-home.png assets/img/screen-quiz.png assets/img/screen-roots.png 2>/dev/null; git add -u assets/img/
git commit -m "ASCスクリーンショットを6言語分コピー、旧スクショを削除"
```

---

### Task 2: i18n.jsを6言語対応に拡張

**Files:**
- Modify: `assets/js/i18n.js`

- [ ] **Step 1: i18n.jsを書き換え**

`assets/js/i18n.js` を以下の内容で置換する:

```javascript
/* Music Influence Chain — LP interactions
   - 6-language toggle (ja/en/zh-Hans/zh-Hant/ko/es)
   - Persisted in localStorage, shared across pages
   - Content lives inline as .lang-{code} spans
   - CSS hides inactive languages via [data-lang] selectors
   - Screenshot images swap via data-screenshot-* attributes */
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

    // Update language selector display
    var current = document.querySelector(".lang-current");
    if (current) {
      var labels = { ja: "日本語", en: "English", "zh-Hans": "简体中文", "zh-Hant": "繁體中文", ko: "한국어", es: "Español" };
      current.textContent = labels[lang] || lang;
    }

    // Mark active option in dropdown
    document.querySelectorAll(".lang-dropdown button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });

    // Swap screenshot images
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

    // Dropdown toggle
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

    // Language option buttons
    document.querySelectorAll(".lang-dropdown button").forEach(function (b) {
      b.addEventListener("click", function () {
        setLang(b.getAttribute("data-lang"));
        if (dropdown) dropdown.classList.remove("open");
      });
    });
  });
})();
```

- [ ] **Step 2: コミット**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
git add assets/js/i18n.js
git commit -m "i18n.jsを6言語対応に拡張（ブラウザ言語検出、ドロップダウン、スクショ切替）"
```

---

### Task 3: style.cssを更新

**Files:**
- Modify: `assets/css/style.css`

- [ ] **Step 1: 言語切替CSSを6言語対応に変更**

`style.css` の既存の言語非表示ルール（90-91行目付近）を以下で置換する:

```css
/* Lang visibility — controlled by <html data-lang> */
[data-lang="ja"] .lang-en,
[data-lang="ja"] .lang-zh-Hans,
[data-lang="ja"] .lang-zh-Hant,
[data-lang="ja"] .lang-ko,
[data-lang="ja"] .lang-es { display: none !important; }

[data-lang="en"] .lang-ja,
[data-lang="en"] .lang-zh-Hans,
[data-lang="en"] .lang-zh-Hant,
[data-lang="en"] .lang-ko,
[data-lang="en"] .lang-es { display: none !important; }

[data-lang="zh-Hans"] .lang-ja,
[data-lang="zh-Hans"] .lang-en,
[data-lang="zh-Hans"] .lang-zh-Hant,
[data-lang="zh-Hans"] .lang-ko,
[data-lang="zh-Hans"] .lang-es { display: none !important; }

[data-lang="zh-Hant"] .lang-ja,
[data-lang="zh-Hant"] .lang-en,
[data-lang="zh-Hant"] .lang-zh-Hans,
[data-lang="zh-Hant"] .lang-ko,
[data-lang="zh-Hant"] .lang-es { display: none !important; }

[data-lang="ko"] .lang-ja,
[data-lang="ko"] .lang-en,
[data-lang="ko"] .lang-zh-Hans,
[data-lang="ko"] .lang-zh-Hant,
[data-lang="ko"] .lang-es { display: none !important; }

[data-lang="es"] .lang-ja,
[data-lang="es"] .lang-en,
[data-lang="es"] .lang-zh-Hans,
[data-lang="es"] .lang-zh-Hant,
[data-lang="es"] .lang-ko { display: none !important; }
```

- [ ] **Step 2: 言語ドロップダウンのスタイルを追加**

既存の `.lang-switch` スタイル（139-162行目付近）を以下で置換する:

```css
.lang-switch {
  position: relative;
}
.lang-toggle {
  appearance: none;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(0,0,0,0.25);
  color: var(--text-dim);
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 7px 28px 7px 13px;
  cursor: pointer;
  transition: 0.2s;
  position: relative;
}
.lang-toggle::after {
  content: "▾";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: var(--text-faint);
}
.lang-toggle:hover { border-color: var(--accent); color: var(--cream-soft); }
.lang-dropdown {
  display: none;
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 140px;
  background: rgba(26, 10, 6, 0.95);
  backdrop-filter: blur(14px);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 6px 0;
  z-index: 60;
  box-shadow: 0 12px 32px rgba(0,0,0,0.5);
}
.lang-dropdown.open { display: block; }
.lang-dropdown button {
  appearance: none;
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  color: var(--text-dim);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  padding: 9px 16px;
  cursor: pointer;
  text-align: left;
  transition: 0.15s;
}
.lang-dropdown button:hover { background: rgba(243,226,179,0.08); color: var(--cream-soft); }
.lang-dropdown button.active { color: var(--accent); font-weight: 700; }
```

- [ ] **Step 3: 告知ゾーンのスタイルを追加**

ファイル末尾（`.reveal` の前）に以下を追加:

```css
/* ---------- Announcement Banner ---------- */
.announcement-banner {
  padding: 0;
  background: linear-gradient(135deg, rgba(106,56,37,0.5) 0%, rgba(74,40,24,0.6) 50%, rgba(58,31,23,0.5) 100%);
  border-bottom: 1px solid var(--line);
}
.announcement-banner .wrap {
  padding-top: 16px;
  padding-bottom: 16px;
}
.announcement-card {
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  padding: 18px 24px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, rgba(212,133,51,0.12), rgba(217,117,72,0.08));
  border: 1px solid rgba(212,133,51,0.3);
  transition: transform 0.2s, border-color 0.2s, background 0.2s;
  position: relative;
  overflow: hidden;
}
.announcement-card:hover {
  transform: translateY(-2px);
  border-color: rgba(212,133,51,0.5);
  background: linear-gradient(135deg, rgba(212,133,51,0.18), rgba(217,117,72,0.12));
}
.announcement-card .ann-badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--terra), var(--terra-deep));
  font-size: 22px;
  box-shadow: 0 4px 12px rgba(168,84,40,0.4);
}
.announcement-card .ann-body { flex: 1; min-width: 0; }
.announcement-card .ann-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--cream-soft);
  margin: 0 0 4px;
}
.announcement-card .ann-desc {
  font-size: 14px;
  color: var(--text-dim);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.announcement-card .ann-price {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(212,133,51,0.12);
  border: 1px solid rgba(212,133,51,0.25);
}
.announcement-card .ann-arrow {
  flex-shrink: 0;
  color: var(--text-faint);
  font-size: 18px;
  transition: transform 0.2s;
}
.announcement-card:hover .ann-arrow { transform: translateX(3px); }

/* ---------- News section ---------- */
.news-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.news-item {
  padding: 22px 26px;
  border-radius: var(--radius);
  background: var(--panel);
  border: 1px solid var(--line);
}
.news-item .news-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.news-item .news-date {
  font-size: 13px;
  color: var(--text-faint);
  font-weight: 500;
}
.news-item .news-category {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(212,133,51,0.1);
}
.news-item .news-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--cream-soft);
  margin: 0 0 8px;
}
.news-item .news-body {
  font-size: 15px;
  color: var(--text-dim);
  margin: 0;
  line-height: 1.7;
}

/* ---------- DLC detail page ---------- */
.dlc-hero {
  padding: 86px 0 50px;
  text-align: center;
}
.dlc-hero .dlc-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 14px;
}
.dlc-hero h1 {
  font-size: clamp(30px, 5vw, 48px);
  color: var(--cream-soft);
  margin: 0 0 16px;
  line-height: 1.15;
}
.dlc-hero .dlc-desc {
  max-width: 60ch;
  margin: 0 auto 24px;
  color: var(--text-dim);
  font-size: 17px;
}
.dlc-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}
.dlc-stat {
  text-align: center;
}
.dlc-stat .stat-num {
  display: block;
  font-size: 36px;
  font-weight: 900;
  color: var(--accent);
  line-height: 1.1;
}
.dlc-stat .stat-label {
  font-size: 13px;
  color: var(--text-faint);
  font-weight: 500;
}

.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  max-width: 1000px;
  margin: 0 auto;
}
.artist-grid .artist-name {
  font-size: 14px;
  color: var(--text-dim);
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--panel);
  border: 1px solid var(--line);
  transition: border-color 0.15s;
}
.artist-grid .artist-name:hover {
  border-color: rgba(212,133,51,0.3);
}

/* ---------- App Store badge ---------- */
.appstore-badge {
  display: inline-block;
  transition: transform 0.15s, filter 0.2s;
}
.appstore-badge:hover { transform: translateY(-2px); filter: brightness(1.1); }
.appstore-badge img { height: 48px; width: auto; }

@media (max-width: 900px) {
  .announcement-card { flex-wrap: wrap; gap: 12px; }
  .announcement-card .ann-price { order: -1; }
  .dlc-stats { gap: 20px; }
}
@media (max-width: 640px) {
  .announcement-card .ann-arrow { display: none; }
  .artist-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
}
```

- [ ] **Step 4: コミット**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
git add assets/css/style.css
git commit -m "CSSを6言語対応・告知ゾーン・お知らせ・DLCページのスタイルに更新"
```

---

### Task 4: index.htmlを全面更新

**Files:**
- Modify: `index.html`

このタスクは `index.html` の全体を書き換える。変更点が多いため、ファイル全体を新しい内容で置換する。

主な変更:
- 全テキスト要素に6言語分のspanを追加（`lang-ja`, `lang-en`, `lang-zh-Hans`, `lang-zh-Hant`, `lang-ko`, `lang-es`）
- `<body>` の `data-title-*` 属性を6言語分に拡張
- ヘッダーの言語切替をドロップダウンに変更
- ヘッダー直下に告知ゾーン追加（DLC第一弾バナー）
- Hero: Coming soon → App Storeバッジ、スクショを `data-screenshot` 属性に変更
- About: 数字（996アーティスト、1170影響関係）を追加
- Modes: Quiz Mode → Roots Route に名称変更、説明文更新
- Screenshots: `data-screenshot` 属性で言語連動
- お知らせセクション追加（FAQ前）
- FAQ: 課金説明・言語の質問を更新
- フッター: App Storeリンク追加

- [ ] **Step 1: index.htmlを書き換え**

`index.html` を設計書に基づき全面書き換えする。6言語のテキストはアプリ側の `LocalizedStrings+*.swift` と `seed.sql` から引用する。

全テキスト要素のパターン:
```html
<span class="lang-ja">日本語テキスト</span>
<span class="lang-en">English text</span>
<span class="lang-zh-Hans">简体中文文本</span>
<span class="lang-zh-Hant">繁體中文文本</span>
<span class="lang-ko">한국어 텍스트</span>
<span class="lang-es">Texto en español</span>
```

ヘッダーの言語セレクター:
```html
<div class="lang-switch" role="group" aria-label="Language">
  <button class="lang-toggle" type="button">
    <span class="lang-current">日本語</span>
  </button>
  <div class="lang-dropdown">
    <button data-lang="ja" type="button">日本語</button>
    <button data-lang="en" type="button">English</button>
    <button data-lang="zh-Hans" type="button">简体中文</button>
    <button data-lang="zh-Hant" type="button">繁體中文</button>
    <button data-lang="ko" type="button">한국어</button>
    <button data-lang="es" type="button">Español</button>
  </div>
</div>
```

告知ゾーン（ヘッダー直下）:
```html
<section class="announcement-banner" id="announcements-banner">
  <div class="wrap">
    <a href="dlc-jrock-pop-v1.html" class="announcement-card dlc-card">
      <span class="ann-badge">🎸</span>
      <div class="ann-body">
        <p class="ann-title">
          <span class="lang-ja">J-Rock & Pop Pack vol.1 配信開始！</span>
          <span class="lang-en">J-Rock & Pop Pack vol.1 — Now Available!</span>
          <span class="lang-zh-Hans">J-Rock & Pop Pack vol.1 现已推出！</span>
          <span class="lang-zh-Hant">J-Rock & Pop Pack vol.1 現已推出！</span>
          <span class="lang-ko">J-Rock & Pop Pack vol.1 출시!</span>
          <span class="lang-es">¡J-Rock & Pop Pack vol.1 ya disponible!</span>
        </p>
        <p class="ann-desc">
          <span class="lang-ja">X JAPAN、B'z、Mr.Children、YOASOBI など197組の日本のロック・ポップアーティストをアンロック</span>
          <span class="lang-en">Unlock 197 Japanese rock & pop artists including X JAPAN, B'z, Mr.Children, YOASOBI and more</span>
          <!-- zh-Hans/zh-Hant/ko/es 同様 -->
        </p>
      </div>
      <span class="ann-price">¥400</span>
      <span class="ann-arrow">→</span>
    </a>
  </div>
</section>
```

Hero の App Store バッジ:
```html
<div class="hero-cta">
  <a class="appstore-badge" href="https://apps.apple.com/jp/app/%E9%9F%B3%E6%A5%BD%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%84%E3%82%92%E3%83%87%E3%82%A3%E3%82%B0%E3%82%8B-roots/id6773954689" target="_blank" rel="noopener">
    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" />
  </a>
  <a class="btn btn-ghost" href="#about">...</a>
</div>
```

スクショの言語連動:
```html
<div class="phone">
  <img data-screenshot="01_home.png" src="assets/img/screenshots/ja/01_home.png" alt="Home screen" />
</div>
```

お知らせセクション（FAQ前に挿入）:
```html
<section id="news" class="section-alt">
  <div class="wrap">
    <div class="section-head reveal">
      <h2>
        <span class="lang-ja">お知らせ</span>
        <span class="lang-en">News</span>
        ...6言語
      </h2>
    </div>
    <div class="news-list">
      <!-- リリース告知 -->
      <div class="news-item">
        <div class="news-meta">
          <span class="news-date">2026-06-29</span>
          <span class="news-category">INFO</span>
        </div>
        <h3 class="news-title">
          <span class="lang-ja">Music Influence Chain 正式リリース！</span>
          ...6言語（seed.sqlから）
        </h3>
        <p class="news-body">
          <span class="lang-ja">Music Influence Chain をダウンロードいただきありがとうございます！レトロなレコード棚のパズルゲームで...</span>
          ...6言語（seed.sqlから）
        </p>
      </div>
      <!-- DLC告知 -->
      <div class="news-item">
        <div class="news-meta">
          <span class="news-date">2026-06-29</span>
          <span class="news-category">UPDATE</span>
        </div>
        <h3 class="news-title">
          <span class="lang-ja">J-Rock & Pop Pack vol.1 配信開始！</span>
          ...6言語（seed.sqlから）
        </h3>
        <p class="news-body">
          <span class="lang-ja">初の DLC パックが登場！X JAPAN、B'z、Mr.Children、YOASOBI など 197 組以上の日本のロック・ポップアーティストをアンロックできます。...</span>
          ...6言語（seed.sqlから）
        </p>
      </div>
    </div>
  </div>
</section>
```

FAQ 課金の質問（更新）:
```html
<details>
  <summary>
    <span class="lang-ja">料金はかかりますか？</span>
    <span class="lang-en">Is the app free?</span>
    ...6言語
  </summary>
  <div class="ans">
    <span class="lang-ja">75アーティストのコアコンテンツは無料でお楽しみいただけます。本編アンロック（¥600）で本編アーティスト計820以上にアクセスできます。さらに追加DLCパックで、テーマ別のアーティストも配信中です。</span>
    <span class="lang-en">You can enjoy core content with 75 artists for free. The Full Game Unlock (¥600) gives you access to over 820 artists. Additional DLC packs with themed artists are also available.</span>
    ...6言語
  </div>
</details>
```

FAQ 言語の質問（更新）:
```html
<details>
  <summary>
    <span class="lang-ja">対応言語は？</span>
    <span class="lang-en">What languages are supported?</span>
    ...6言語
  </summary>
  <div class="ans">
    <span class="lang-ja">日本語・英語・簡体字中国語・繁体字中国語・韓国語・スペイン語の6言語に対応しています。</span>
    <span class="lang-en">The app supports six languages: Japanese, English, Simplified Chinese, Traditional Chinese, Korean, and Spanish.</span>
    ...6言語
  </div>
</details>
```

- [ ] **Step 2: ブラウザで表示確認**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
open index.html
```

言語切替が正常に動作し、全セクションが6言語で表示されることを確認する。

- [ ] **Step 3: コミット**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
git add index.html
git commit -m "index.htmlを全面更新（6言語化、告知ゾーン、スクショ更新、お知らせ、FAQ修正）"
```

---

### Task 5: DLC詳細ページを新規作成

**Files:**
- Create: `dlc-jrock-pop-v1.html`

- [ ] **Step 1: dlc-jrock-pop-v1.htmlを作成**

共通のヘッダー・フッター構造を index.html から流用。ページ固有の内容:

```html
<!-- DLC Hero -->
<section class="dlc-hero">
  <div class="wrap">
    <span class="dlc-tag">DLC PACK</span>
    <h1>
      <span class="lang-ja">邦ロック・ポップパック ver1</span>
      <span class="lang-en">J-Rock & Pop Pack vol.1</span>
      <span class="lang-zh-Hans">J-Rock & Pop Pack vol.1</span>
      <span class="lang-zh-Hant">J-Rock & Pop Pack vol.1</span>
      <span class="lang-ko">J-Rock & Pop Pack vol.1</span>
      <span class="lang-es">J-Rock & Pop Pack vol.1</span>
    </h1>
    <p class="dlc-desc">
      <span class="lang-ja">初の DLC パックが登場！X JAPAN、B'z、Mr.Children、YOASOBI など 197 組の日本のロック・ポップアーティストをアンロックできます。J-Rock・J-Pop のルーツを深く探求しましょう！</span>
      <span class="lang-en">The first DLC pack is here! Unlock 197 Japanese rock and pop artists including X JAPAN, B'z, Mr.Children, YOASOBI, and many more. Dive deep into the roots of J-Rock and J-Pop!</span>
      ...6言語（seed.sqlから引用）
    </p>
    <div class="dlc-stats">
      <div class="dlc-stat">
        <span class="stat-num">197</span>
        <span class="stat-label">
          <span class="lang-ja">アーティスト</span>
          <span class="lang-en">Artists</span>
          ...
        </span>
      </div>
      <div class="dlc-stat">
        <span class="stat-num">¥400</span>
        <span class="stat-label">
          <span class="lang-ja">価格</span>
          <span class="lang-en">Price</span>
          ...
        </span>
      </div>
    </div>
    <a class="appstore-badge" href="https://apps.apple.com/jp/app/..." target="_blank" rel="noopener">
      <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" />
    </a>
    <p style="margin-top:12px;font-size:14px;color:var(--text-faint);">
      <span class="lang-ja">※ アプリ内から購入できます</span>
      <span class="lang-en">* Available as an in-app purchase</span>
      ...6言語
    </p>
  </div>
</section>

<!-- Artist list -->
<section class="section-alt">
  <div class="wrap">
    <div class="section-head reveal" style="text-align:center;margin-left:auto;margin-right:auto;">
      <h2>
        <span class="lang-ja">収録アーティスト一覧</span>
        <span class="lang-en">Included Artists</span>
        ...6言語
      </h2>
    </div>
    <div class="artist-grid">
      <!-- 197アーティストをアルファベット順に列挙 -->
      <div class="artist-name">
        <span class="lang-ja">10-FEET</span>
        <span class="lang-en">10-Feet</span>
        ...
      </div>
      <!-- ... 全197件 ... -->
    </div>
  </div>
</section>
```

アーティスト一覧データは、先ほど取得した197件のDLCアーティスト情報（`name` と `localizedNames`）をHTMLに直書きする。

- [ ] **Step 2: ブラウザで表示確認**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
open dlc-jrock-pop-v1.html
```

- [ ] **Step 3: コミット**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
git add dlc-jrock-pop-v1.html
git commit -m "DLC詳細ページを新規作成（197アーティスト全一覧、6言語対応）"
```

---

### Task 6: プライバシーポリシーを更新

**Files:**
- Modify: `privacy.html`

- [ ] **Step 1: privacy.htmlを書き換え**

既存の `privacy.html` を6言語対応で全面書き換え。変更点:
- テンプレート表記（「本ページは一般的なひな形です」）を削除
- 第三者サービスに Supabase、RevenueCat、Apple Game Center を追加
- 収集データを明確化（デバイスローカル / Supabase読み取りのみ / RevenueCat / Game Center）
- 全テキストを6言語のspan切替に
- 日付を 2026-06-30 に更新

構造は既存の `.legal` クラスレイアウトを維持。

- [ ] **Step 2: コミット**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
git add privacy.html
git commit -m "プライバシーポリシーを更新（Supabase/RevenueCat/Game Center反映、6言語化）"
```

---

### Task 7: 利用規約を更新

**Files:**
- Modify: `terms.html`

- [ ] **Step 1: terms.htmlを書き換え**

既存の `terms.html` を6言語対応で全面書き換え。変更点:
- テンプレート表記を削除
- 課金体系を明記（Free 75 / Base ¥600 / DLC ¥400〜）
- 返金ポリシー（Appleの返金ポリシーに準拠）を追加
- データソース免責は維持
- 全テキストを6言語のspan切替に
- 日付を 2026-06-30 に更新

構造は既存の `.legal` クラスレイアウトを維持。

- [ ] **Step 2: コミット**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
git add terms.html
git commit -m "利用規約を更新（課金体系明記、6言語化）"
```

---

### Task 8: 最終確認とプッシュ

**Files:** なし（確認のみ）

- [ ] **Step 1: 全ページの表示確認**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
open index.html
open dlc-jrock-pop-v1.html
open privacy.html
open terms.html
```

各ページで以下を確認:
- 6言語すべての切替が正常に動作する
- 告知ゾーンがクリックでDLC詳細ページに遷移する
- スクリーンショットが言語に連動して切り替わる
- App Storeバッジのリンクが正しい
- レスポンシブ表示（モバイル幅）が崩れていない
- DLC詳細ページの197アーティストが全件表示される
- お知らせセクションの表示が正常

- [ ] **Step 2: リモートにプッシュ**

```bash
cd "/Users/maiki-dantyou/Main Folder/Programming/Music Influence Chain LP"
git push origin main
```
