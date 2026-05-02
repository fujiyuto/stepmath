import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import Column, DateTime
from sqlalchemy.types import Uuid
from sqlmodel import Field, SQLModel


class Conversation(SQLModel, table=True):
    """ユーザーと問題の会話セッションモデル。

    1ユーザーが1問題に対して開始した会話（チャットセッション）を表す。

    Attributes:
        id: 主キー
        user_id: 紐づくユーザーのID（外部キー、UUID）
        problem_id: 紐づく問題のID（外部キー）
        created_at: 作成日時
        updated_at: 更新日時（レコード更新時に自動更新）
    """

    __tablename__ = 'conversations'

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", sa_type=Uuid)
    problem_id: uuid.UUID = Field(foreign_key="problems.id", sa_type=Uuid)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False),
    )
