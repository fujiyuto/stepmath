import uuid
from sqlmodel import Session, select

from exceptions import DatabaseError, NotFoundException, InternalServerError
from models import Problem

def create_problem(
    field_id: int,
    session: Session
) -> uuid.UUID:
    """Claudeに問題生成してもらい、生成した問題をDBに登録し、problem_idを返却する。

    Args:
        university_math_type_id: 分野ID
        session: DBセッション
    
    Returns:
        problem_id: 作成した問題ID

    Raises:
        DatabaseError: DB操作に失敗した場合
    """

    # todo: claude apiによる問題生成
    problem_text = "問題です"
    answer = "答えです"

    try:
        problem = Problem(field_id=field_id, problem_text=problem_text,answer=answer)
        session.add(problem)
        session.commit()
        session.refresh(problem)
    except Exception as e:
        # todo：ロギング処理
        raise InternalServerError()

    return problem.id


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
    except Exception as e:
        # todo：ロギング処理
        raise InternalServerError()


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
    except Exception as e:
        raise InternalServerError()

    if not problem:
        raise NotFoundException(message="問題が見つかりません")
    return problem
