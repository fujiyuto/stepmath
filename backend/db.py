from pathlib import Path
from typing import Generator

from pydantic_settings import BaseSettings
from sqlmodel import Session, create_engine


class Settings(BaseSettings):
    """アプリケーション設定クラス。

    .envファイルから環境変数を読み込む。
    """

    DATABASE_URL: str
    SUPABASE_JWT_SECRET: str

    model_config = {"env_file": Path(__file__).parent / ".env", "extra": "ignore"}


settings = Settings()

# PostgreSQL接続engineを生成
engine = create_engine(settings.DATABASE_URL)


def get_db() -> Generator[Session, None, None]:
    """DBセッションを生成する依存注入用ジェネレータ。

    FastAPIのDependsで使用し、リクエストごとにセッションを生成・クローズする。

    Yields:
        Session: SQLModelのDBセッション
    """
    with Session(engine) as session:
        yield session
