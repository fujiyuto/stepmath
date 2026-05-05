from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class Role(str, Enum):
    """メッセージの送信者ロール。

    Attributes:
        user: ユーザーからのメッセージ
        assistant: AIアシスタントからのメッセージ
    """

    user = "user"
    assistant = "assistant"

class ConversationMessages(BaseModel):
    """会話内のメッセージ

    role: ユーザー or AIアシスタント
    content: メッセージ内容
    created_at: メッセージ作成日時
    """

    role: Role
    content: str
    created_at: datetime


class ConversationGetResponse(BaseModel):
    """会話詳細取得レスポンスクラス

    university_name: 大学名
    math_type: 文系 or 理系
    field: 分野
    problem_text: 問題文
    messages: メッセージのリスト
    """
    
    university_name: str
    math_type: str | None = None
    field: str
    problem_text: str
    messages: list[ConversationMessages] = []

