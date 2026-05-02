from pydantic import BaseModel, Field, field_validator

class MessageCreateRequest(BaseModel):
    """メッセージ送信時のリクエストモデル

    message: メッセージ
    """

    message: str = Field(max_length=500)

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("メッセージを入力してください")

        return v
