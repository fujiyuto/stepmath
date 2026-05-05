from pydantic import BaseModel

class UserCreateResponse(BaseModel):
    """ユーザー登録時レスポンスクラス

    message: メッセージ
    """

    message: str