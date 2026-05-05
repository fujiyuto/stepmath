from typing import Optional

from sqlmodel import Field as SQLField, SQLModel


class Fields(SQLModel, table=True):
    """分野モデル。

    Attributes:
        id: 主キー（連番）
        university_math_type_id: 大学数学タイプID（university_math_typesへの外部キー）
        label: 分野名
        order: 表示順
    """

    __tablename__ = 'fields'

    id: Optional[int] = SQLField(default=None, primary_key=True)
    university_math_type_id: int = SQLField(foreign_key='university_math_types.id')
    label: str
    order: int
