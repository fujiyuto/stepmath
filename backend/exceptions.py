from fastapi import Request
from fastapi.responses import JSONResponse


class AppException(Exception):
    """アプリケーション例外の基底クラス。

    Attributes:
        status_code: HTTPステータスコード
        detail: エラーメッセージ
    """

    def __init__(self, status_code: int, message: str, detail: str) -> None:
        self.status_code = status_code
        self.message = message
        self.detail = detail
        super().__init__(detail)


class HttpException(AppException):
    """汎用HTTPエラー。status_codeとdetailを任意に指定する。

    Args:
        status_code: HTTPステータスコード
        detail: エラーメッセージ
    """

    def __init__(self, status_code: int, message: str, detail: str) -> None:
        super().__init__(status_code=status_code, detail=detail)


class NotFoundException(AppException):
    """リソースが見つからない場合のエラー（404）。

    Args:
        detail: エラーメッセージ（デフォルト: "リソースが見つかりません"）
    """

    def __init__(self, message: str, detail: str = "リソースが見つかりません") -> None:
        super().__init__(status_code=404, detail=detail)


class DatabaseError(AppException):
    """DB操作中にエラーが発生した場合のエラー（500）。

    Args:
        detail: エラーメッセージ（デフォルト: "DB操作中にエラーが発生しました"）
    """

    def __init__(self, message: str, detail: str = "DB操作中にエラーが発生しました") -> None:
        super().__init__(status_code=500, detail=detail)


class InternalServerError(AppException):
    """予期しないシステムエラーが発生した場合のエラー（500）。

    Args:
        detail: エラーメッセージ（デフォルト: "内部サーバーエラーが発生しました"）
    """

    def __init__(self, message: str, detail: str = "内部サーバーエラーが発生しました") -> None:
        super().__init__(status_code=500, detail=detail)


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
