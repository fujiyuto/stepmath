import uuid

from pydantic import BaseModel


class ConversationCreateRequest(BaseModel):
    """会話作成時のリクエストモデル。

    problem_id: 問題ID
    """

    problem_id: int
    