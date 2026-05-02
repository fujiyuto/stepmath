import uuid
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Problem(SQLModel, table=True):
    """大学受験数学の問題モデル。

    Attributes:
        id: 主キー（UUID）
        university: 出題大学名
        field: 数学の分野（例: 微積分、数列）
        problem_text: 問題文（LaTeX形式）
        answer: 解答（LaTeX形式）
        created_at: 作成日時
    """

    __tablename__ = 'problems'

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    university: str
    field: str
    problem_text: str
    answer: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
