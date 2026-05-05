from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from db import get_db
from schemas.request import ProblemCreateRequest
from schemas.response import ProblemCreateResponse
from services import problem_service

router = APIRouter(
    prefix="/problems",
    tags=["problems"],
)

@router.post("/")
async def create_problem(
    problem_create_request: ProblemCreateRequest,
    session: Annotated[Session, Depends(get_db)]
) -> ProblemCreateResponse:
    """問題を作成する。Claude APIを使用する。

    Args:
        problem_create_request: 問題作成リクエスト
        session: DBセッション
    Returns:
        ProblemCreateResponse: 問題作成レスポンス
    """
    
    problem_id = problem_service.create_problem(problem_create_request.field_id, session)

    return ProblemCreateResponse(problem_id=problem_id)
