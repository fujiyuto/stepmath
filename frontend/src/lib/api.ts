const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

/**
 * FastAPI バックエンドへのリクエスト共通ラッパー。
 * @param path - APIパス（例: "/users"）
 * @param method - HTTPメソッド
 * @param body - リクエストボディ（任意）
 * @returns レスポンスのJSONデータ
 */
async function request<T>(path: string, method: HttpMethod, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error ${res.status}: ${error}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  /**
   * GETリクエスト。
   * @param path - APIパス
   */
  get: <T>(path: string) => request<T>(path, "GET"),

  /**
   * POSTリクエスト。
   * @param path - APIパス
   * @param body - リクエストボディ
   */
  post: <T>(path: string, body: unknown) => request<T>(path, "POST", body),

  /**
   * PATCHリクエスト。
   * @param path - APIパス
   * @param body - リクエストボディ
   */
  patch: <T>(path: string, body: unknown) => request<T>(path, "PATCH", body),

  /**
   * DELETEリクエスト。
   * @param path - APIパス
   */
  delete: <T>(path: string) => request<T>(path, "DELETE"),
};
