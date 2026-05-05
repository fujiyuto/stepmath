from pydantic import BaseModel


class ProblemCreateRequest(BaseModel):
    """問題作成リクエストクラス

    field_id: 分野情報ID
    """

    field_id: int