import uuid
from typing import Any

from sqlmodel import Session, select

from exceptions import DatabaseError, NotFoundException
from models import Conversation, Fields, Message, Problem, University, UniversityMathType


def get_conversations(user_id: uuid.UUID, session: Session) -> list[Any]:
    """ユーザーの会話一覧を取得する。

    Args:
        user_id: ユーザーID
        session: DBセッション

    Returns:
        list[Any]: 会話一覧（university_name, math_type, field, problem_text, updated_at を含む行）

    Raises:
        DatabaseError: DB操作に失敗した場合
    """
    try:
        rows = session.exec(
            select(
                University.name.label("university_name"),
                UniversityMathType.math_type,
                Fields.label.label("field"),
                Problem.problem_text,
                Conversation.updated_at,
            )
            .select_from(Conversation)
            .join(Problem, Conversation.problem_id == Problem.id)
            .join(Fields, Problem.field_id == Fields.id)
            .join(UniversityMathType, Fields.university_math_type_id == UniversityMathType.id)
            .join(University, UniversityMathType.university_id == University.id)
            .where(Conversation.user_id == user_id)
        ).all()
    except Exception:
        raise DatabaseError(message="会話一覧の取得に失敗しました")

    return list(rows)


def get_conversation(conversation_id: uuid.UUID, session: Session) -> tuple[Any, list[Message]]:
    """会話詳細とメッセージ一覧を取得する。

    Args:
        conversation_id: 会話ID
        session: DBセッション

    Returns:
        tuple[Any, list[Message]]: 会話情報行とメッセージ一覧

    Raises:
        NotFoundException: 会話が見つからない場合
        DatabaseError: DB操作に失敗した場合
    """
    try:
        row = session.exec(
            select(
                University.name.label("university_name"),
                UniversityMathType.math_type,
                Fields.label.label("field"),
                Problem.problem_text,
            )
            .select_from(Conversation)
            .join(Problem, Conversation.problem_id == Problem.id)
            .join(Fields, Problem.field_id == Fields.id)
            .join(UniversityMathType, Fields.university_math_type_id == UniversityMathType.id)
            .join(University, UniversityMathType.university_id == University.id)
            .where(Conversation.id == conversation_id)
        ).first()
    except Exception:
        raise DatabaseError(message="会話の取得に失敗しました")

    if not row:
        raise NotFoundException(message="会話が見つかりません")

    try:
        message_rows = session.exec(
            select(Message).where(Message.conversation_id == conversation_id)
        ).all()
    except Exception:
        raise DatabaseError(message="メッセージ一覧の取得に失敗しました")

    return row, list(message_rows)


def create_conversation(
    user_id: uuid.UUID, problem_id: uuid.UUID, session: Session
) -> Any:
    """会話を作成する。

    Args:
        user_id: ユーザーID
        problem_id: 問題ID
        session: DBセッション

    Returns:
        Any: 作成した会話に紐づく問題・大学情報（university_name, math_type, field, problem_text を含む行）

    Raises:
        NotFoundException: 問題が見つからない場合
        DatabaseError: DB操作に失敗した場合
    """
    try:
        conversation = Conversation(user_id=user_id, problem_id=problem_id)
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
    except Exception:
        raise DatabaseError(message="会話の作成に失敗しました")

    # 問題情報を JOIN で一括取得
    try:
        row = session.exec(
            select(
                University.name.label("university_name"),
                UniversityMathType.math_type,
                Fields.label.label("field"),
                Problem.problem_text,
            )
            .select_from(Problem)
            .join(Fields, Problem.field_id == Fields.id)
            .join(UniversityMathType, Fields.university_math_type_id == UniversityMathType.id)
            .join(University, UniversityMathType.university_id == University.id)
            .where(Problem.id == problem_id)
        ).first()
    except (NotFoundException, DatabaseError):
        raise
    except Exception:
        raise DatabaseError(message="会話作成後の情報取得に失敗しました")

    if not row:
        raise NotFoundException(message="問題が見つかりません")

    return row


def send_message(conversation_id: uuid.UUID, message: str, session: Session) -> Message:
    """チャットメッセージを送信する。

    Args:
        conversation_id: 会話ID
        message: メッセージ内容
        session: DBセッション

    Returns:
        Message: 保存されたユーザーメッセージ

    Raises:
        NotFoundException: 会話が見つからない場合
        DatabaseError: DB操作に失敗した場合
    """
    conversation = session.get(Conversation, conversation_id)
    if not conversation:
        raise NotFoundException(message="会話が見つかりません")

    try:
        user_message = Message(
            conversation_id=conversation_id,
            role="user",
            content=message,
        )
        session.add(user_message)
        session.commit()
        session.refresh(user_message)
    except Exception:
        raise DatabaseError(message="メッセージの送信に失敗しました")

    # TODO: Claude API 連携で AI 返信を生成する
    return user_message
