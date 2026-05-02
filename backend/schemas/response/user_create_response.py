from pydantic import BaseModel

class UserCreateResponse(BaseModel):
    """ユーザー登録時レスポンスクラス

    message: メッセージ
    """

    def __init__(self, created: bool, message: str):
        self.message = message

    message: str