const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";
type ApiResult<T> =
  | {
      result: T;
      ok: true;
    }
  | {
      result: ErrorResponse;
      ok: false;
    };
type ErrorResponse = {
  message: string;
};

/**
 * FastAPI バックエンドへのリクエスト共通ラッパー。
 * @param path - APIパス（例: "/users"）
 * @param method - HTTPメソッド
 * @param body - リクエストボディ（任意）
 * @param token - Supabase アクセストークン（任意）。渡すと Authorization: Bearer ヘッダーに付与される
 * @returns レスポンスのJSONデータ
 */
async function request<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  token?: string
): Promise<ApiResult<T>> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const result = await res.json();

  return res.ok
    ? { result: result as T, ok: true as const }
    : { result: result as ErrorResponse, ok: false as const };
}

export const api = {
  /**
   * GETリクエスト。
   * @param path - APIパス
   * @param token - Supabase アクセストークン（任意）
   */
  get: <T>(path: string, token?: string) =>
    request<T>(path, "GET", undefined, token),

  /**
   * POSTリクエスト。
   * @param path - APIパス
   * @param body - リクエストボディ
   * @param token - Supabase アクセストークン（任意）
   */
  post: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, "POST", body, token),

  /**
   * PATCHリクエスト。
   * @param path - APIパス
   * @param body - リクエストボディ
   * @param token - Supabase アクセストークン（任意）
   */
  patch: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, "PATCH", body, token),

  /**
   * DELETEリクエスト。
   * @param path - APIパス
   * @param token - Supabase アクセストークン（任意）
   */
  delete: <T>(path: string, token?: string) =>
    request<T>(path, "DELETE", undefined, token),
};
