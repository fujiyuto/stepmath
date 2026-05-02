import uuid
from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Column
from sqlalchemy import Enum as SAEnum
from sqlmodel import Field, SQLModel
from sqlalchemy.types import Uuid


class Role(str, Enum):
    """メッセージの送信者ロール。

    Attributes:
        user: ユーザーからのメッセージ
        assistant: AIアシスタントからのメッセージ
    """

    user = "user"
    assistant = "assistant"


class Message(SQLModel, table=True):
    """会話内の個別メッセージモデル。

    Attributes:
        id: 主キー
        conversation_id: 紐づく会話のID（外部キー）
        role: メッセージ送信者のロール（"user" または "assistant"）
        content: メッセージ本文
        created_at: 作成日時
    """

    __tablename__ = 'messages'

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(foreign_key="conversations.id", sa_type=Uuid)
    role: Role = Field(
        sa_column=Column(
            SAEnum(Role, name="message_role", values_callable=lambda x: [e.value for e in x]),
            nullable=False,
        )
    )
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
