from typing import List, Optional

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import ARRAY, VARCHAR
from sqlmodel import Field, SQLModel


class UniversityMathType(SQLModel, table=True):
    """大学の数学タイプモデル。

    Attributes:
        id: 主キー（連番）
        university_id: 大学ID（universitiesへの外部キー）
        math_type: 数学タイプ（"理系" / "文系"）
        tendency_text: 出題傾向テキスト
    """

    __tablename__ = 'university_math_types'

    id: Optional[int] = Field(default=None, primary_key=True)
    university_id: int = Field(foreign_key='universities.id')
    math_type: Optional[str] = Field(nullable=True)
    tendency_text: str
