# Moa Lab Software Library

Moa Lab の Android アプリと LINE スタンプを紹介する、Next.js 製のランディングサイトです。

- 本番URL: https://moa-software-library.pages.dev/
- 主な掲載内容: アプリ紹介、LINEスタンプ紹介、プライバシーポリシー

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- CSS (コンポーネント単位 + グローバルスタイル)

## Requirements

- Node.js 20 以上推奨
- npm

## Getting Started

```bash
npm install
npm run dev
```

開発サーバー起動後、`http://localhost:3000` を開いて確認できます。

## Scripts

```bash
npm run dev    # 開発サーバー
npm run build  # 本番ビルド
npm run start  # 本番ビルド起動
npm run lint   # ESLint 実行
```

## Project Structure

```text
src/
  app/
    layout.tsx                 # ルートレイアウト・メタデータ
    page.tsx                   # トップページ
    privacy-policy/page.tsx    # プライバシーポリシーページ
  components/
    Hero/
    Apps/
    Stickers/
    Card/
    Footer/
  hooks/
    useFadeIn.ts
    useFadeInSelector.ts
    usePageLoader.ts
    useHeaderScroll.ts
  App.css                      # 共通スタイル

public/images/                 # 画像アセット
```

## Notes

- UI 文言は日本語を基本にしています。
- 画像は `public/images/<category>/` 配下に配置してください。
- 変更後は `npm run lint` で静的チェックを実行してください。
