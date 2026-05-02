import Link from "next/link";

/**
 * ユーザー登録ページ。
 */
export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-8 rounded-xl border border-gray-200">
        <h1 className="text-2xl font-bold text-center">新規登録</h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              ユーザー名
            </label>
            <input
              id="username"
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            登録する
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </main>
  );
}
