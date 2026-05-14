import Link from "next/link";

/**
 * OAuth認証エラーページ。
 * @returns 認証失敗時のエラーメッセージとログインページへのリンク
 */
export default function AuthCodeErrorPage() {
    return (
        <main className="min-h-screen pt-24 bg-page-bg">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md px-10 py-12 text-center">
                <h1 className="text-xl font-bold text-text-body">認証に失敗しました</h1>
                <p className="mt-3 text-sm text-text-secondary">
                    Googleアカウントでの認証中にエラーが発生しました。
                    <br />
                    もう一度お試しください。
                </p>
                <Link
                    href="/users/signin"
                    className="mt-6 inline-block text-sm text-primary hover:underline"
                >
                    ログインページへ戻る
                </Link>
            </div>
        </main>
    );
}
