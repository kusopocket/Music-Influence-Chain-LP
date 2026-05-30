# Music Influence Chain — Landing Page

iOSアプリ **Music Influence Chain** の公式ランディングページです。  
The official landing page for the iOS app **Music Influence Chain**.

レコード棚から音楽のルーツをたどる、影響の連鎖をめぐる音楽クイズ。  
A music quiz that traces the chain of influence between artists — from the record shelf to the roots.

---

## 公開方法 / How to publish (GitHub Pages)

このリポジトリはそのまま GitHub Pages として公開できます。追加のビルドは不要です。  
This repo is ready to publish on GitHub Pages as-is. No build step required.

1. このフォルダの内容を GitHub リポジトリにプッシュします。  
   Push the contents of this folder to a GitHub repository.
2. リポジトリの **Settings → Pages** を開きます。  
   Open **Settings → Pages** in the repository.
3. **Build and deployment → Source** を **Deploy from a branch** に設定。  
   Set **Build and deployment → Source** to **Deploy from a branch**.
4. Branch を **main**（フォルダは **/ (root)**）に設定して保存。  
   Choose branch **main** and folder **/ (root)**, then save.
5. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。  
   After a few minutes, the site goes live at `https://<username>.github.io/<repo>/`.

> リンクはすべて相対パスなので、ユーザーサイト（`<username>.github.io`）でもプロジェクトサイト（サブパス）でもそのまま動作します。  
> All links are relative, so the site works both at a user site and a project (sub-path) site.

---

## 構成 / Structure

```
index.html          トップページ / Landing page
terms.html          利用規約 / Terms of Service
privacy.html        プライバシーポリシー / Privacy Policy
assets/
  css/style.css     スタイル / Styles (rosewood theme)
  js/i18n.js        日本語・英語切替＋演出 / JA·EN toggle + interactions
  img/              ロゴ・スクリーンショット / Logo & screenshots
.nojekyll           Jekyll 処理を無効化 / Skip Jekyll processing
```

## メモ / Notes

- 言語は右上のトグルで日本語／英語を切り替えられ、選択は端末に保存されます。  
  Language toggles between Japanese and English (top right); the choice is saved on the device.
- 利用規約・プライバシーポリシーは**一般的なひな形**です。公開前に運営者名・連絡先など実情に合わせてご確認ください。  
  The Terms and Privacy pages are **general templates** — please review them before publishing.
- お問い合わせ導線: <https://forms.gle/2GQbnnwkBEz3miRp9>
- 画像・データは Wikipedia / Wikimedia Commons より取得。  
  Images & data are sourced from Wikipedia / Wikimedia Commons.
