from models import User
from pydantic import BaseModel

class UserDeleteResponse(BaseModel):
    """ユーザー削除レスポンスクラス

    message: メッセージ
    """

    message: str