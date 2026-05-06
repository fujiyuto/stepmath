from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from db import engine
from exceptions import AppException, app_exception_handler
from routers import users, conversations, universities, problems
from settings import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """アプリ起動時にSupabaseへテーブルを自動作成する。"""
    if settings.ENVIRONMENT == "development":
        SQLModel.metadata.drop_all(engine)
        SQLModel.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(users.router)
app.include_router(conversations.router)
app.include_router(universities.router)
app.include_router(problems.router)
app.add_exception_handler(AppException, app_exception_handler)


@app.get("/")
async def root():
    return {"message": "Hello World"}