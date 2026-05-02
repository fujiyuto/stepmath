from models import User
from pydantic import BaseModel

class UserDeleteResponse(BaseModel):
    """ユーザー削除レスポンスクラス

    message: メッセージ
    """

    def __init__(self, message: str):
        self.message = message

    message: str