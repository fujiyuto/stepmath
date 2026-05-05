import uuid
from datetime import datetime

from sqlmodel import Field, SQLModel


class Problem(SQLModel, table=True):
    """大学受験数学の問題モデル。

    Attributes:
        id: 主キー（UUID）
        field_id: 分野ID（fieldsへの外部キー）
        problem_text: 問題文（LaTeX形式）
        answer: 解答（LaTeX形式）
        created_at: 作成日時
    """

    __tablename__ = 'problems'

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    field_id: int = Field(foreign_key='fields.id')
    problem_text: str
    answer: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
