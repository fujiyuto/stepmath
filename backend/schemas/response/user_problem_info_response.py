from pydantic import BaseModel


class FieldCount(BaseModel):
    label: str
    count: int


class UserProblemInfoResponse(BaseModel):
    total_count: int
    by_field: list[FieldCount]
