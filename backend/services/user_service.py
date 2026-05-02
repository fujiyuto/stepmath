import uuid

from sqlmodel import Session

from exceptions import DatabaseError, NotFoundException
from models import User


def get_user(user_id: uuid.UUID, session: Session) -> User:
    """ユーザー詳細を取得する。

    Args:
        user_id: ユーザーID
        session: DBセッション

    Returns:
        User: ユーザー情報

    Raises:
        NotFoundException: ユーザーが見つからない場合
    """
    user = session.get(User, user_id)
    if not user:
        raise NotFoundException(message="ユーザーが見つかりません")
    return user


def create_user(id: uuid.UUID, email: str, username: str, session: Session) -> User:
    """ユーザーを登録する。

    Args:
        id: SupabaseのユーザーUUID
        email: メールアドレス
        username: ユーザー名
        session: DBセッション

    Returns:
        User: 登録したユーザー情報

    Raises:
        DatabaseError: DB操作に失敗した場合
    """
    try:
        user = User(id=id, email=email, username=username)
        session.add(user)
        session.commit()
        session.refresh(user)
    except Exception:
        raise DatabaseError(message="ユーザーの登録に失敗しました")
    return user


def edit_user(user_id: uuid.UUID, username: str, session: Session) -> User:
    """ユーザー情報を編集する。

    Args:
        user_id: ユーザーID
        username: 新しいユーザー名
        session: DBセッション

    Returns:
        User: 更新後のユーザー情報

    Raises:
        NotFoundException: ユーザーが見つからない場合
        DatabaseError: DB操作に失敗した場合
    """
    user = session.get(User, user_id)
    if not user:
        raise NotFoundException(message="ユーザーが見つかりません")

    try:
        user.username = username
        session.add(user)
        session.commit()
        session.refresh(user)
    except Exception:
        raise DatabaseError(message="ユーザーの更新に失敗しました")
    return user


def delete_user(user_id: uuid.UUID, session: Session) -> None:
    """ユーザーを削除する。

    Args:
        user_id: 削除するユーザーID
        session: DBセッション

    Raises:
        NotFoundException: ユーザーが見つからない場合
        DatabaseError: DB操作に失敗した場合
    """
    user = session.get(User, user_id)
    if not user:
        raise NotFoundException(message="ユーザーが見つかりません")

    try:
        session.delete(user)
        session.commit()
    except Exception:
        raise DatabaseError(message="ユーザーの削除に失敗しました")
