from sqlmodel import Session, select

from exceptions import DatabaseError, NotFoundException
from models import Problem


def get_problems(session: Session) -> list[Problem]:
    """問題一覧を取得する。

    Args:
        session: DBセッション

    Returns:
        list[Problem]: 問題一覧

    Raises:
        DatabaseError: DB操作に失敗した場合
    """
    try:
        return session.exec(select(Problem)).all()
    except Exception:
        raise DatabaseError(message="問題一覧の取得に失敗しました")


def get_problem(problem_id: int, session: Session) -> Problem:
    """問題詳細を取得する。

    Args:
        problem_id: 問題ID
        session: DBセッション

    Returns:
        Problem: 問題詳細

    Raises:
        NotFoundException: 問題が見つからない場合
        DatabaseError: DB操作に失敗した場合
    """
    try:
        problem = session.get(Problem, problem_id)
    except Exception:
        raise DatabaseError(message="問題の取得に失敗しました")

    if not problem:
        raise NotFoundException(message="問題が見つかりません")
    return problem
