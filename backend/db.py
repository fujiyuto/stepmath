from pathlib import Path
from typing import Generator

from sqlmodel import Session, create_engine
from settings import settings


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
