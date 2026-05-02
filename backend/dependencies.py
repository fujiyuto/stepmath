import uuid
from typing import Annotated

import jwt
from fastapi import Header, HTTPException

from db import settings


async def get_auth_user_id(
    token: Annotated[str | None, Header(alias="X-Token")] = None,
) -> uuid.UUID:
    """X-TokenヘッダーからアクセストークンをデコードしてユーザーIDを返す。

    Args:
        token: X-Tokenヘッダーの値（Supabase JWTアクセストークン）

    Returns:
        uuid.UUID: トークンのsubクレームから取得したユーザーID

    Raises:
        HTTPException: X-Tokenヘッダーがない場合 401
        HTTPException: トークンの有効期限が切れている場合 401
        HTTPException: トークンが無効な場合 401
    """
    if token is None:
        raise HTTPException(status_code=401, detail="X-Tokenヘッダーがありません")

    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return uuid.UUID(payload["sub"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="トークンの有効期限が切れています")
    except (jwt.InvalidTokenError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="無効なトークンです")
