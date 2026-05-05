from pydantic import BaseModel

class PopularFields(BaseModel):
    """頻出分野

    order: 表示順序
    label: 表示名
    """

    order: int
    label: str


class UniversitiesGetResponse(BaseModel):
    """大学情報取得レスポンスクラス

    university_name: 大学名
    university_math_type_id: university_math_typesのID
    math_type: 文系 or 理系
    fields: 頻出分野リスト
    """

    university_name: str
    university_math_type_id: int
    math_type: str | None = None
    fields: list[PopularFields]