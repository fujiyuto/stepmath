import uuid
from typing import ClassVar

from pydantic import BaseModel, field_validator, EmailStr, Field
import re

class UserCreateRequest(BaseModel):
    """ユーザー登録時にリクエストクラス

    email：メールアドレス
    username: ユーザー名
    """

    email: EmailStr
    username: str = Field(min_length=3, max_length=30)

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("ユーザー名は半角英数字とアンダースコアのみ使用できます")

        return v
