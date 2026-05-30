新しいDB設計
universities

id: UUID
name: str

university_math_types

id: UUID
university_id: UUID（universitiesへの外部キー）
math_type: str（"理系" / "文系"）
popular_fields: array（PostgreSQLのARRAY型）
tendency_text: str

problems（修正）

id: UUID
university_math_type_id: UUID（university_math_typesへの外部キー）
field: str
problem_text: str（LaTeX）
answer: str
created_at: datetime