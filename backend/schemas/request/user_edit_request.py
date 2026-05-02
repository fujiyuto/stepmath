from pydantic import BaseModel, field_validator
import re

class UserEditRequest(BaseModel):
    """ユーザー編集時のリクエストモデル

    username: ユーザー名
    """

    username: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError("ユーザー名は半角英数字とアンダースコアのみ使用できます")

        return v
