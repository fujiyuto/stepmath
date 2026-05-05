from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from db import get_db
from schemas.response import UniversitiesGetResponse
from schemas.response.universities_get_response import PopularFields
from services import university_service

router = APIRouter(
    prefix="/universities",
    tags=["universities"],
)


@router.get("/")
async def get_universities(session: Annotated[Session, Depends(get_db)]) -> list[UniversitiesGetResponse]:
    """大学一覧を取得する。

    Args:
        session: DBセッション

    Returns:
        list[UniversitiesGetResponse]: 大学情報一覧
    """
    rows = university_service.get_universities(session)
    return [
        UniversitiesGetResponse(
            university_name=row.university_name,
            math_type=row.math_type,
            fields=[
                PopularFields(order=i + 1, label=field)
                for i, field in enumerate(row.popular_fields or [])
            ],
        )
        for row in rows
    ]
