from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from db import get_db
from services import problem_service

router = APIRouter(
    prefix="/problems",
    tags=["problems"],
)


@router.get("/")
async def get_problems(session: Annotated[Session, Depends(get_db)]):
    """問題一覧を取得する。

    Args:
        session: DBセッション

    Returns:
        list[Problem]: 問題一覧
    """
    return problem_service.get_problems(session)


@router.get("/{problem_id}")
async def get_problem(
    problem_id: int,
    session: Annotated[Session, Depends(get_db)],
):
    """問題詳細を取得する。

    Args:
        problem_id: 問題ID
        session: DBセッション

    Returns:
        Problem: 問題詳細
    """
    return problem_service.get_problem(problem_id, session)
