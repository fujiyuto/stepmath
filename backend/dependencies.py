import uuid
from typing import Annotated

import jwt
from jwt import PyJWKClient
from fastapi import Header, HTTPException

from settings import settings

jwks_client = PyJWKClient(f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json")


async def get_auth_user_id(
    authorization: Annotated[str | None, Header()] = None,
) -> uuid.UUID:
    """AuthorizationヘッダーからアクセストークンをデコードしてユーザーIDを返す。

    Args:
        authorization: Authorizationヘッダーの値（Bearer <Supabase JWTアクセストークン>）

    Returns:
        uuid.UUID: トークンのsubクレームから取得したユーザーID

    Raises:
        HTTPException: Authorizationヘッダーがない場合 401
        HTTPException: トークンの有効期限が切れている場合 401
        HTTPException: トークンが無効な場合 401
    """
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorizationヘッダーがありません")

    token = authorization.removeprefix("Bearer ")

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated",
        )
        return uuid.UUID(payload["sub"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="トークンの有効期限が切れています")
    except (jwt.InvalidTokenError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="無効なトークンです")
