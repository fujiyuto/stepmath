# Frontend

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## コマンド
- 開発サーバー起動: `npm run dev`

## ディレクトリ構成
```
src/
  app/              # ルーティング（App Router）
  components/
    ui/             # 汎用コンポーネント（Button, Input, Modal...）
    features/       # 機能別コンポーネント（auth/, dashboard/...）
    layouts/        # Header, Footer, Sidebar
  hooks/            # カスタムフック
  lib/              # API呼び出し・ユーティリティ
  types/            # 型定義
```

### コンポーネント設計原則
- `ui/`：ビジネスロジックを持たない汎用部品
- `features/`：`ui/`をインポートして使う機能単位のコンポーネント。他のfeatureに依存させない
- Server Componentをデフォルトとし、インタラクション・hooksが必要な場合のみ`"use client"`を付ける
- 同じUIが3箇所以上登場したらコンポーネント化を検討する
- `useState`が5個以上になったらカスタムフックに切り出す

## コーディング規約
- 型ヒントを必ず付ける
- 数式はKaTeXで描画する

## コメント規約
- 全関数にJSDocを付ける
  - 処理概要・@param・@returnsを必ず記載