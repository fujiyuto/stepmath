from pydantic import BaseModel

class UserGetResponse(BaseModel):
    """ユーザー詳細取得レスポンスモデル

    username: ユーザー名
    """

    username: str

