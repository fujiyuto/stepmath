from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import SQLModel

from db import engine
from exceptions import AppException, app_exception_handler
from routers import users, problems, conversations


@asynccontextmanager
async def lifespan(app: FastAPI):
    """アプリ起動時にSupabaseへテーブルを自動作成する。"""
    SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(users.router)
app.include_router(problems.router)
app.include_router(conversations.router)
app.add_exception_handler(AppException, app_exception_handler)


@app.get("/")
async def root():
    return {"message": "Hello World"}