import uuid
from sqlmodel import Session, select, func

from exceptions import NotFoundException, InternalServerError
from models import Problem, Conversation, Fields

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


def get_user_problem_info(
    user_id: uuid.UUID, session: Session
) -> tuple[int, list[tuple[str, int]]]:
    """ユーザーの作成した問題数と分野別内訳を集計して返す。

    Args:
        user_id: ユーザーID
        session: DBセッション

    Returns:
        tuple[int, list[tuple[str, int]]]: (総問題数, [(分野ラベル, 件数), ...])

    Raises:
        InternalServerError: DB操作に失敗した場合
    """
    try:
        # Conversation → Problem → Fields をJOINして分野ごとに集計
        rows = session.exec(
            select(Fields.label, func.count(Conversation.id))
            .join(Problem, Problem.field_id == Fields.id)
            .join(Conversation, Conversation.problem_id == Problem.id)
            .where(Conversation.user_id == user_id)
            .group_by(Fields.label)
        ).all()
    except Exception:
        raise InternalServerError()

    total_count = sum(count for _, count in rows)
    return total_count, rows


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
