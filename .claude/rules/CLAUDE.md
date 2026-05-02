# stepmath

## プロジェクト概要
大学受験数学の難問をStep分解して段階的に解かせるEdTechサービス。

## 技術スタック
- Frontend: Next.js + KaTeX
- Backend: Python + FastAPI
- ORM: SQLModel
- DB: Supabase（PostgreSQL）
- AI: Claude API（anthropic SDK）

## コマンド

### Backend
# プロジェクトルートから実行
- 仮想環境の有効化: `source backend/.venv/bin/activate`
- 開発サーバー起動: `fastapi dev backend/main.py`
- ※必ず仮想環境を有効化してから起動すること

### Frontend
- 開発サーバー起動: `npm run dev`

### DB
- マイグレーション: `alembic upgrade head`

## コーディング規約
- 型ヒントを必ず付ける
- 数式はLaTeX形式で扱う
- Claude APIのレスポンスはJSON形式で受け取る
- エラーは明示的にraiseする

## コメント規約

### Backend（Python）
- 全関数にpydocを付ける
  - 処理概要・Args・Returnsを必ず記載
- 関数内はコメントを見て処理の流れが追える程度に記載
  - 1文ごとは不要。処理のまとまりごとに1コメント目安

### Frontend（TypeScript）
- 全関数にJSDocを付ける
  - 処理概要・@param・@returnsを必ず記載
- 関数内はBackendと同様、処理のまとまりごとにコメント

### 共通
- コメントは日本語で記載

## 注意事項
- IMPORTANT: Claude APIのAPIキーは.envから読み込む。コードに直書き禁止
- IMPORTANT: DBマイグレーションファイルは直接編集しない
- IMPORTANT: DB接続情報は.envのDATABASE_URLで管理する
- DBはSupabase（PostgreSQL）を使用
- 問題データの生成はservices/claude.pyに集約する