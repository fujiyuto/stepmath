from pydantic import BaseModel

class MessageCreateResponse(BaseModel):
    """チャット送信レスポンスクラス

    content: メッセージ内容
    """

    content: str
    