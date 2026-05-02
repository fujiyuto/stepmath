import uuid

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from db import get_db
from dependencies import get_auth_user_id
from schemas.request import ConversationCreateRequest, MessageCreateRequest
from services import conversation_service

router = APIRouter(
    prefix="/conversations",
    tags=["conversations"],
)


@router.post("/")
async def create_conversation(
    user_id: Annotated[uuid.UUID, Depends(get_auth_user_id)],
    conversation_create_request: ConversationCreateRequest,
    session: Annotated[Session, Depends(get_db)],
):
    """会話を作成する。

    Args:
        conversation_create: 会話作成リクエスト（user_id, problem_id）
        session: DBセッション

    Returns:
        Conversation: 作成した会話
    """
    return conversation_service.create_conversation(user_id, conversation_create_request.problem_id, session)


@router.post("/{conversation_id}/messages")
async def send_message(
    user_id: Annotated[uuid.UUID, Depends(get_auth_user_id)],
    conversation_id: int,
    message_create_request: MessageCreateRequest,
    session: Annotated[Session, Depends(get_db)],
):
    """チャットメッセージを送信する。

    Args:
        conversation_id: 会話ID
        message_create: メッセージ送信リクエスト
        session: DBセッション

    Returns:
        Message: 送信したメッセージ
    """
    return conversation_service.send_message(conversation_id, message_create_request.message, session)
