import logging
import uuid
from typing import Annotated

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from db import get_db
from dependencies import get_auth_user_id
from schemas.request import UserCreateRequest, UserEditRequest
from schemas.response import UserGetResponse, UserCreateResponse, UserEditResponse, UserDeleteResponse
from services import user_service
from settings import settings

logger = logging.getLogger(__name__)

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

    try:
        user_service.create_user(
            user_id,
            user_create_request.email,
            user_create_request.username,
            session,
        )
    except Exception:
        # DB登録失敗 → Supabase Auth ユーザーを削除してロールバック
        async with httpx.AsyncClient() as client:
            try:
                await client.delete(
                    f"{settings.SUPABASE_URL}/auth/v1/admin/users/{user_id}",
                    headers={
                        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
                    },
                )
            except Exception:
                logger.error("Supabase Auth ロールバック失敗: user_id=%s", user_id)
        raise HTTPException(status_code=500, detail="ユーザー登録に失敗しました")

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
