from models import User
from pydantic import BaseModel

class UserGetResponse(BaseModel):
    """ユーザー詳細取得レスポンスモデル

    email: メールアドレス
    username: ユーザー名
    """

    def __init__(self, user: User):
        self.email = user.email
        self.username = user.username

    email: str
    username: str

