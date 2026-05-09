# Backend

## コマンド
# プロジェクトルートから実行
- 仮想環境の有効化: `source backend/.venv/bin/activate`
- 開発サーバー起動: `fastapi dev backend/main.py`
- ※必ず仮想環境を有効化してから起動すること

## DB
- マイグレーション: `alembic upgrade head`

## コーディング規約
- 型ヒントを必ず付ける
- エラーは明示的にraiseする

## コメント規約
- 全関数にpydocを付ける
  - 処理概要・Args・Returnsを必ず記載

## アーキテクチャ規約
- レスポンス用スキーマへの詰め替えはrouter層で行う