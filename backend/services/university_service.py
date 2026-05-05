from typing import Any

from sqlmodel import Session, select

from exceptions import DatabaseError
from models import University, UniversityMathType


def get_universities(session: Session) -> list[Any]:
    """大学一覧を取得する。

    Args:
        session: DBセッション

    Returns:
        list[Any]: 大学情報一覧（university_name, math_type, popular_fields を含む行）

    Raises:
        DatabaseError: DB操作に失敗した場合
    """
    try:
        rows = session.exec(
            select(
                University.name.label("university_name"),
                UniversityMathType.math_type,
                UniversityMathType.popular_fields,
            )
            .select_from(University)
            .join(UniversityMathType, University.id == UniversityMathType.university_id)
        ).all()
    except Exception:
        raise DatabaseError(message="大学一覧の取得に失敗しました")

    return list(rows)
