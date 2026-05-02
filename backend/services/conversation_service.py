import uuid

from sqlmodel import Session

from exceptions import DatabaseError, NotFoundException
from models import Conversation, Message


def create_conversation(user_id: uuid.UUID, problem_id: int, session: Session) -> Conversation:
    """会話を作成する。

    Args:
        user_id: ユーザーID
        problem_id: 問題ID
        session: DBセッション

    Returns:
        Conversation: 作成した会話

    Raises:
        DatabaseError: DB操作に失敗した場合
    """
    try:
        conversation = Conversation(
            user_id=user_id,
            problem_id=problem_id,
        )
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
    except Exception:
        raise DatabaseError(message="会話の作成に失敗しました")
    return conversation


def send_message(conversation_id: int, message: str, session: Session) -> Message:
    """チャットメッセージを送信する。

    Args:
        conversation_id: 会話ID
        message: メッセージ内容
        session: DBセッション

    Returns:
        Message: 送信したメッセージ

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
    return user_message
