import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from db import get_db
from dependencies import get_auth_user_id
from schemas.request import UserCreateRequest, UserEditRequest
from schemas.response import UserGetResponse, UserCreateResponse, UserEditResponse, UserDeleteResponse
from services import user_service

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.get("/me")
async def get_user(
    user_id: Annotated[uuid.UUID, Depends(get_auth_user_id)],
    session: Annotated[Session, Depends(get_db)]
) -> UserGetResponse:
    """ユーザー詳細を取得する。

    Args:
        user_id: JWTから取得したユーザーID
        session: DBセッション

    Returns:
        email: メールアドレス
        username: ユーザー名 
    """
    user = user_service.get_user(user_id, session)
    return UserGetResponse(email=user.email, username=user.username)


@router.post("/")
async def create_user(
    user_id: Annotated[uuid.UUID, Depends(get_auth_user_id)],
    user_create_request: UserCreateRequest,
    session: Annotated[Session, Depends(get_db)],
):
    """ユーザーを登録する。

    Args:
        user_id: JWTから取得したユーザーID
        user_create_request: ユーザー登録リクエスト
        session: DBセッション

    Returns:
        created: 登録完了可否
        message: メッセージ
    """

    user_service.create_user(
        user_id,
        user_create_request.email,
        user_create_request.username,
        session,
    )
    return UserCreateResponse(message="登録が完了しました")


@router.patch("/me")
async def edit_user(
    user_id: Annotated[uuid.UUID, Depends(get_auth_user_id)],
    user_edit_request: UserEditRequest,
    session: Annotated[Session, Depends(get_db)],
):
    """ユーザー情報を編集する。

    Args:
        user_id: JWTから取得したユーザーID
        user_edit: ユーザー編集リクエスト
        session: DBセッション

    Returns:
        username: ユーザー名
    """
    user = user_service.edit_user(user_id, user_edit_request.username, session)
    return UserEditResponse(username=user.username)


@router.delete("/me")
async def delete_user(
    user_id: Annotated[uuid.UUID, Depends(get_auth_user_id)],
    session: Annotated[Session, Depends(get_db)],
):
    """ユーザーを削除する。

    Args:
        user_id: 削除するユーザーID（クエリパラメータ）
        session: DBセッション

    Returns:
        deleted: 削除可否
        message: メッセージ
    """

    user_service.delete_user(user_id, session)
    return UserDeleteResponse(message="削除が完了しました")
