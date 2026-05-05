import uuid

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from db import get_db
from dependencies import get_auth_user_id
from schemas.request import ConversationCreateRequest, MessageCreateRequest
from schemas.response import (
    ConversationsGetResponse,
    ConversationGetResponse,
    ConversationCreateResponse,
    MessageCreateResponse,
)
from schemas.response.conversation_get_response import ConversationMessages
from schemas.response.conversations_get_response import ConversationResponse
from services import conversation_service

router = APIRouter(
    prefix="/conversations",
    tags=["conversations"],
)


@router.get("/")
async def get_conversations(
    user_id: Annotated[uuid.UUID, Depends(get_auth_user_id)],
    session: Annotated[Session, Depends(get_db)],
) -> ConversationsGetResponse:
    """ユーザーの会話一覧を取得する。

    Args:
        user_id: JWTから取得したユーザーID
        session: DBセッション

    Returns:
        ConversationsGetResponse: 過去の会話一覧
    """
    rows = conversation_service.get_conversations(user_id, session)
    return ConversationsGetResponse(
        conversations=[
            ConversationResponse(
                university_name=row.university_name,
                math_type=row.math_type,
                field=row.field,
                problem_text=row.problem_text,
                updated_at=row.updated_at,
            )
            for row in rows
        ]
    )


@router.get("/{conversation_id}")
async def get_conversation(
    user_id: Annotated[uuid.UUID, Depends(get_auth_user_id)],
    conversation_id: uuid.UUID,
    session: Annotated[Session, Depends(get_db)],
) -> ConversationGetResponse:
    """会話詳細とメッセージ一覧を取得する。

    Args:
        user_id: JWTから取得したユーザーID
        conversation_id: 会話ID
        session: DBセッション

    Returns:
        ConversationGetResponse: 会話詳細とメッセージ一覧
    """
    row, messages = conversation_service.get_conversation(conversation_id, session)
    return ConversationGetResponse(
        university_name=row.university_name,
        math_type=row.math_type,
        field=row.field,
        problem_text=row.problem_text,
        messages=[
            ConversationMessages(
                role=msg.role,
                content=msg.content,
                created_at=msg.created_at,
            )
            for msg in messages
        ],
    )


@router.post("/")
async def create_conversation(
    user_id: Annotated[uuid.UUID, Depends(get_auth_user_id)],
    conversation_create_request: ConversationCreateRequest,
    session: Annotated[Session, Depends(get_db)],
) -> ConversationCreateResponse:
    """会話を作成する。

    Args:
        user_id: ユーザーID
        conversation_create_request: 会話作成リクエスト（university_math_type_id）
        session: DBセッション

    Returns:
        ConversationCreateResponse: 会話詳細とメッセージ一覧
    """
    row = conversation_service.create_conversation(
        user_id, conversation_create_request.problem_id, session
    )

    return ConversationCreateResponse(
        university_name=row.university_name,
        math_type=row.math_type,
        field=row.field,
        problem_text=row.problem_text,
    )


@router.post("/{conversation_id}/messages")
async def send_message(
    user_id: Annotated[uuid.UUID, Depends(get_auth_user_id)],
    conversation_id: uuid.UUID,
    message_create_request: MessageCreateRequest,
    session: Annotated[Session, Depends(get_db)],
) -> MessageCreateResponse:
    """チャットメッセージを送信する。

    Args:
        conversation_id: 会話ID
        message_create_request: メッセージ送信リクエスト
        session: DBセッション

    Returns:
        MessageCreateResponse: AIからの返信メッセージ
    """
    message = conversation_service.send_message(
        conversation_id, message_create_request.message, session
    )
    return MessageCreateResponse(content=message.content)
