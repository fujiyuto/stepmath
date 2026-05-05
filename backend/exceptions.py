from fastapi import Request
from fastapi.responses import JSONResponse


class AppException(Exception):
    """アプリケーション例外の基底クラス。

    Attributes:
        status_code: HTTPステータスコード
        message: クライアントに返すエラーメッセージ
    """

    def __init__(self, status_code: int, message: str) -> None:
        self.status_code = status_code
        self.message = message
        super().__init__(message)


class HttpException(AppException):
    """汎用HTTPエラー。status_codeとmessageを任意に指定する。

    Args:
        status_code: HTTPステータスコード
        message: エラーメッセージ
    """

    def __init__(self, status_code: int, message: str) -> None:
        super().__init__(status_code=status_code, message=message)


class NotFoundException(AppException):
    """リソースが見つからない場合のエラー（404）。

    Args:
        message: エラーメッセージ（デフォルト: "リソースが見つかりません"）
    """

    def __init__(self, message: str = "リソースが見つかりません") -> None:
        super().__init__(status_code=404, message=message)


class DatabaseError(AppException):
    """DB操作中にエラーが発生した場合のエラー（500）。

    Args:
        message: エラーメッセージ（デフォルト: "DB操作中にエラーが発生しました"）
    """

    def __init__(self, message: str = "DB操作中にエラーが発生しました") -> None:
        super().__init__(status_code=500, message=message)


class InternalServerError(AppException):
    """予期しないシステムエラーが発生した場合のエラー（500）。

    Args:
        message: エラーメッセージ（デフォルト: "内部サーバーエラーが発生しました"）
    """

    def __init__(self, message: str = "内部サーバーエラーが発生しました") -> None:
        super().__init__(status_code=500, message=message)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """AppExceptionおよびそのサブクラスをJSONレスポンスに変換するハンドラ。

    Args:
        request: FastAPIのリクエストオブジェクト
        exc: 発生したAppException

    Returns:
        JSONResponse: status_codeとdetailを含むレスポンス
    """
    # todo:detailをロギング

    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.message},
    )
