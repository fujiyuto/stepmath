from typing import Optional

from sqlmodel import Field, SQLModel


class University(SQLModel, table=True):
    """大学モデル。

    Attributes:
        id: 主キー（連番）
        name: 大学名
    """

    __tablename__ = 'universities'

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
