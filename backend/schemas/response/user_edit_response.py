from models import User
from pydantic import BaseModel

class UserEditResponse(BaseModel):
    """ユーザー編集レスポンスクラス

    username: ユーザー名
    """

    def __init__(self, user: User):
        self.username = user.username

    username: str