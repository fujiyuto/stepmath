import Link from "next/link";

/**
 * メールアドレス変更確認メール送信完了ページ。
 * @returns 確認メール送信完了を知らせるページ
 */
export default function UserEmailEditConfirmPage() {
  return (
    <main className="h-screen pt-24 bg-page-bg">
      <div className="w-lg mx-auto bg-white rounded-2xl shadow-sm px-10 py-12">
        <h1 className="text-xl font-bold text-text-body text-center">
          確認メールを送信しました
        </h1>
        <p className="mt-4 text-sm text-text-secondary text-center">
          新しいメールアドレス宛に確認メールを送信しました。<br />
          メール内のリンクをクリックして、変更を完了してください。
        </p>
        <div className="mt-8">
          <Link
            href="/users/me"
            className="block w-full py-3 text-sm text-text-body text-center border border-border rounded-lg hover:bg-surface-hover transition"
          >
            ユーザー詳細に戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
