import Link from "next/link";

/**
 * パスワード変更完了ページ。
 * @returns パスワード変更完了を知らせるページ
 */
export default function UserPasswordEditCompletePage() {
  return (
    <div className="w-lg mx-auto bg-white rounded-2xl shadow-sm px-10 py-12">
      <h1 className="text-xl font-bold text-text-body text-center">
        パスワードを変更しました
      </h1>
      <p className="mt-4 text-sm text-text-secondary text-center">
        パスワードの変更が完了しました。
      </p>
      <div className="mt-8">
        <Link
          href="/users/me"
          className="block w-full py-3 text-sm text-text-body text-center border border-border rounded-lg hover:bg-surface-hover transition"
        >
          アカウントページへ戻る
        </Link>
      </div>
    </div>
  );
}
