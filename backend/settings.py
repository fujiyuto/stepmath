from pathlib import Path

from pydantic_settings import BaseSettings

class _Settings(BaseSettings):
    """アプリケーション設定クラス。

    .envファイルから環境変数を読み込む。
    """

    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    ENVIRONMENT: str

    model_config = {"env_file": Path(__file__).parent / ".env", "extra": "ignore"}

settings = _Settings()