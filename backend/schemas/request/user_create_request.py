import re

from pydantic import BaseModel, field_validator, Field

class UserCreateRequest(BaseModel):
    """ユーザー登録時にリクエストクラス

    username: ユーザー名
    """

    username: str = Field(min_length=3, max_length=30)

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("ユーザー名は半角英数字とアンダースコアのみ使用できます")

        return v
