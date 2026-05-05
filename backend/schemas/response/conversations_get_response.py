from datetime import datetime
from pydantic import BaseModel


class ConversationResponse(BaseModel):
    """会話一覧の各要素

    university_name: 大学名
    math_type: 文系 or 理系
    field: 分野
    problem_text: 問題文
    updated_at: 会話の更新日時
    """

    university_name: str
    math_type: str | None = None
    field: str
    problem_text: str
    updated_at: datetime

class ConversationsGetResponse(BaseModel):
    """会話一覧取得レスポンスクラス

    conversations: 会話一覧
    """
    
    conversations: list[ConversationResponse]
