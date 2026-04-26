from fastapi import FastAPI, Query
from dto.item import Item
from typing import Annotated
from pydantic import Field

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

# @app.get("/{id}")
# async def detail(id: int):
#     return {"message": f'id:{id}を受信しました'}

# クエリパラメータ
@app.get("/items", tags=["item"])
async def read_item(needy: str, skip: int = 0, limit: int = 0, q: Annotated[str | None, Query(max_length=3)] = None):
    return {"message": f'クエリパラメータ、skip:{skip}, limit:{limit}, 必須のパラメータ:{needy}'}

# リクエストボディ
@app.post("/items")
async def create_item(item: Item):
    print(item.name + item.price)
    return item