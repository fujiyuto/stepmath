import uuid
from pydantic import BaseModel

class ProblemCreateResponse(BaseModel):
    """問題作成レスポンスクラス

    problem_id: 問題ID
    """
    
    problem_id: uuid.UUID