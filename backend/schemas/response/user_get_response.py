from models import User
from pydantic import BaseModel

class UserGetResponse(BaseModel):
    """ユーザー詳細取得レスポンスモデル

    email: メールアドレス
    username: ユーザー名
    """

    email: str
    username: str

