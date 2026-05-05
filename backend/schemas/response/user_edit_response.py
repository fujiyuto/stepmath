from models import User
from pydantic import BaseModel

class UserEditResponse(BaseModel):
    """ユーザー編集レスポンスクラス

    username: ユーザー名
    """

    username: str