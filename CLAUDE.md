# enthink

## プロジェクト概要
思考の言語化を通じて、数学的思考力を鍛えるEdTechサービス。

## 技術スタック
- Frontend: Next.js + KaTeX
- Backend: Python + FastAPI
- ORM: SQLModel
- DB: Supabase（PostgreSQL）
- AI: Claude API（anthropic SDK）

## コーディング規約
- 数式はLaTeX形式で扱う
- Claude APIのレスポンスはJSON形式で受け取る

## コメント規約（共通）
- コメントは日本語で記載
- 関数内はコメントを見て処理の流れが追える程度に記載
  - 1文ごとは不要。処理のまとまりごとに1コメント目安

## 注意事項
- IMPORTANT: Claude APIのAPIキーは.envから読み込む。コードに直書き禁止
- IMPORTANT: DBマイグレーションファイルは直接編集しない
- IMPORTANT: DB接続情報は.envのDATABASE_URLで管理する
- DBはSupabase（PostgreSQL）を使用
- 問題データの生成はservices/claude.pyに集約する