import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from db import get_db
from dependencies import get_auth_user_id
from schemas.request import ProblemCreateRequest
from schemas.response import ProblemCreateResponse, UserProblemInfoResponse, FieldCount
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

@router.get("/me")
async def get_user_problem_info(
    user_id: Annotated[uuid.UUID, Depends(get_auth_user_id)],
    session: Annotated[Session, Depends(get_db)]
) -> UserProblemInfoResponse:
    """ユーザーの作成した問題についてのデータを取得する。

    Args:
        user_id: JWTから取得したユーザーID
        session: DBセッション

    Returns:
        UserProblemInfoResponse: 総問題数と分野別件数
    """

    total_count, rows = problem_service.get_user_problem_info(user_id, session)
    return UserProblemInfoResponse(
        total_count=total_count,
        by_field=[FieldCount(label=label, count=count) for label, count in rows],
    )
