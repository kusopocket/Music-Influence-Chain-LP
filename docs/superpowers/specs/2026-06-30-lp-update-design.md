# LP最新仕様更新 設計書

**日付**: 2026-06-30
**ステータス**: 承認済み

## 概要

Music Influence Chain のLPサイトを最新のアプリ仕様に合わせて更新する。
Supabase連携は行わず、すべて静的HTMLに直書きする。

## 変更対象ファイル

| ファイル | 変更内容 |
|---|---|
| `index.html` | 全面改修（6言語化、告知ゾーン追加、コンテンツ更新、お知らせ追加） |
| `assets/js/i18n.js` | 6言語対応に拡張、ブラウザ言語検出 |
| `assets/css/style.css` | 告知ゾーン、DLCバナー、お知らせセクション等のスタイル追加 |
| `privacy.html` | Supabase/RevenueCat/Game Center等を反映、6言語化 |
| `terms.html` | DLC/IAP課金体系を反映、6言語化 |
| `dlc-jrock-pop-v1.html` | **新規作成** — DLC詳細ページ（197アーティスト全一覧） |

## スクリーンショット

ASC用スクリーンショット（アプリプロジェクト `Screenshots/appstore/iphone17/`）をLP側の `assets/img/screenshots/` にコピーして使用する。

配置構成:
```
assets/img/screenshots/
  ja/01_home.png, 02_quiz.png, 03_beatles_roots.png
  en/01_home.png, 02_quiz.png, 03_beatles_roots.png
  zh-Hans/01_home.png, 02_quiz.png, 03_beatles_roots.png
  zh-Hant/01_home.png, 02_quiz.png, 03_beatles_roots.png
  ko/01_home.png, 02_quiz.png, 03_beatles_roots.png
  es/01_home.png, 02_quiz.png, 03_beatles_roots.png
```

言語切替に連動して対応言語のスクリーンショットを表示する。

## 1. 多言語対応（2言語 → 6言語）

### 対応言語
ja, en, zh-Hans, zh-Hant, ko, es

### 切替方式
既存のspan切替パターンを拡張。各テキスト要素に `lang-ja`, `lang-en`, `lang-zh-Hans`, `lang-zh-Hant`, `lang-ko`, `lang-es` クラスのspanを配置し、現在の言語に応じて `display: none` / `display: inline` を切り替える。

### 言語セレクター
ヘッダーのボタン2個 → ドロップダウンメニューに変更。表示ラベル:
- 日本語
- English
- 简体中文
- 繁體中文
- 한국어
- Español

### ブラウザ言語検出
`navigator.language` を判定し、対応言語があればデフォルトに設定。マッチしない場合は `en` をデフォルトにする。`localStorage` に選択言語を保存し、再訪時に復元する。

## 2. 告知ゾーン（ヘッダー直下）

ヘッダーの直下、Heroセクションの上に設置する横幅いっぱいのバナー領域。

### 構造
```html
<section id="announcements-banner">
  <a href="dlc-jrock-pop-v1.html" class="announcement-card dlc-card">
    <!-- DLC告知内容 -->
  </a>
  <!-- 将来の告知はここに追加 -->
</section>
```

### 現在の告知: DLC第一弾
- タイトル: 「J-Rock & Pop Pack vol.1 配信開始！」（6言語）
- 概要: 「初のDLCパックが登場！X JAPAN、B'z、Mr.Children、YOASOBI など197組の日本のロック・ポップアーティストをアンロック」（6言語）
- 価格: ¥400（小さめ表示）
- デザイン: 目立つグラデーション背景、アクセントカラー
- クリックで `dlc-jrock-pop-v1.html` に遷移

### 拡張性
告知カードは独立したHTMLブロック。新しいDLC・大型アプデの告知は `.announcement-card` を追加するだけ。

## 3. Heroセクション

- キャッチコピーは維持（「音楽のルーツをたどる、一枚ずつ」相当、6言語）
- 「Coming soon on iOS」→ App Storeバッジに変更
- App Store URL: `https://apps.apple.com/jp/app/%E9%9F%B3%E6%A5%BD%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%84%E3%82%92%E3%83%87%E3%82%A3%E3%82%B0%E3%82%8B-roots/id6773954689`
- メインビジュアル: ASCスクショの `01_home.png`（言語連動）

## 4. Aboutセクション

基本コンセプトは維持しつつ、数字を更新:
- 「996人以上のアーティスト収録」
- 「1170以上の影響関係」
- 6言語対応であることを明記
- Wikipedia/Wikimedia Commonsをデータソースとして引き続き記載

## 5. Modesセクション

3モードの名称と説明を更新:

| モード | 説明 |
|---|---|
| Roots Route | 60秒タイマー、4ライフの4択クイズ。アーティストの影響関係を当てる |
| Custom Route | 時代・地域・ジャンルでフィルターしてプレイするカスタムモード |
| Roots Library | 全アーティストの影響ツリーを閲覧できるブラウズモード |

## 6. Screenshotsセクション

- ASCスクショ3枚を使用（`01_home`, `02_quiz`, `03_beatles_roots`）
- 言語切替に連動して対応言語のスクショに切り替わる
- iPhoneフレームのモックアップ表示

## 7. お知らせセクション

FAQの前に「お知らせ」セクションを追加。seed.sqlの2件を直書き:

1. **リリース告知**（priority: 10）
   - タイトル: 「Music Influence Chain 正式リリース！」（6言語）
   - 本文: アプリの紹介テキスト（6言語、seed.sqlから引用）
   - 日付: 2026-06-29

2. **DLC告知**（priority: 9）
   - タイトル: 「J-Rock & Pop Pack vol.1 配信開始！」（6言語）
   - 本文: DLCの紹介テキスト（6言語、seed.sqlから引用）
   - 日付: 2026-06-29

## 8. FAQセクション

更新内容:

| Q | A（要約） |
|---|---|
| 無料ですか？ | 75アーティストのコアコンテンツは無料。本編アンロック（¥600）で本編アーティスト計820以上にアクセス。さらにDLCパックで追加アーティストも配信中。 |
| データの出典は？ | Wikipedia/Wikimedia Commons（維持） |
| 対応言語は？ | 日本語・英語・簡体字中国語・繁体字中国語・韓国語・スペイン語の6言語 |
| 音楽は再生できますか？ | いいえ（維持） |
| バグ報告・要望は？ | Google Formリンク（維持） |

## 9. DLC詳細ページ（`dlc-jrock-pop-v1.html`）

### 構成
- ヘッダー（index.htmlと共通ナビゲーション、言語切替）
- DLC概要
  - パック名: J-Rock & Pop Pack vol.1 / 邦ロック・ポップパック ver1（6言語）
  - 説明テキスト（seed.sqlのお知らせ本文を流用）
  - 追加アーティスト数: 197
  - 価格: ¥400
- アーティスト全一覧
  - 197アーティスト名をグリッド表示
  - 言語切替に連動（日本語名/英語名等）
  - アルファベット順ソート
- App Storeリンク（「アプリ内から購入できます」案内）
- フッター（index.htmlと共通）

### アーティスト一覧データ
artists.jsonから `packId === 'dlc-jrock-pop-v1'` のアーティスト197件を抽出し、HTMLに直書きする。各アーティストの `name`（英語表示名）と `localizedNames`（6言語の表示名）を含める。

## 10. プライバシーポリシー更新（`privacy.html`）

テンプレート表記を削除し、実際の利用サービスを反映:

### 追加する第三者サービス
- **Supabase**: アーティスト・クイズデータのホスティング、お知らせ配信
- **RevenueCat**: アプリ内課金（本編アンロック、DLC）の管理
- **Apple Game Center**: ランキング・リーダーボード

### 収集データの明確化
- デバイス上のみの保存: ゲーム設定、お気に入り、スコア
- Supabase経由: アーティスト・クイズデータの読み取りのみ（個人情報の送信なし）
- RevenueCat: 購入トランザクション（Apple ID経由、アプリは直接個人情報を収集しない）
- Game Center: Apple Game Centerのプライバシーポリシーに準拠

### 6言語化
privacy.htmlも6言語のspan切替方式に対応。

## 11. 利用規約更新（`terms.html`）

### 更新内容
- テンプレート表記を削除
- 課金体系を明記:
  - 無料コンテンツ（75アーティスト）
  - 本編アンロック（¥600）
  - DLCパック（個別価格、現在 ¥400〜）
- 返金ポリシー: Appleの返金ポリシーに準拠
- データソース（Wikipedia/Wikimedia Commons）の免責事項は維持

### 6言語化
terms.htmlも6言語のspan切替方式に対応。

## App Store URL

```
https://apps.apple.com/jp/app/%E9%9F%B3%E6%A5%BD%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%84%E3%82%92%E3%83%87%E3%82%A3%E3%82%B0%E3%82%8B-roots/id6773954689
```

ヘッダー、Hero、DLC詳細ページ、フッターに配置。

## 数値サマリー

| 項目 | 値 |
|---|---|
| Freeアーティスト | 75 |
| Baseアーティスト（本編アンロック） | 746 |
| 本編アンロック後の合計 | 821 (≈ 820以上) |
| DLC J-Rock & Pop v1 | 197 |
| 全アーティスト合計 | 1018 (≈ 996 カタログ) |
| 影響関係数 | 1170以上 |
| 本編アンロック価格 | ¥600 |
| DLC価格 | ¥400 |
