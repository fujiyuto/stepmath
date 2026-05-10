"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * メールアドレス変更完了ページ。
 * URLのtoken_hashを検証してメールアドレス変更を確定する。
 * @returns メールアドレス変更完了を知らせるページ
 */
export default function UserEmailEditCompletePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const supabase = createClient();

  useEffect(() => {
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    const verify = async () => {
        if (!token_hash || type !== "email_change") {
            return "error"
        }

        const { error } = await supabase.auth.verifyOtp({ token_hash, type: "email_change" })
        return error ? "error" : "success"
    }

    verify().then(v => setStatus(v))
  }, []);

  return (
    <main className="h-screen pt-24 bg-page-bg">
      <div className="w-lg mx-auto bg-white rounded-2xl shadow-sm px-10 py-12">
        {status === "loading" && (
          <p className="text-sm text-text-secondary text-center">確認中...</p>
        )}
        {status === "success" && (
          <>
            <h1 className="text-xl font-bold text-text-body text-center">
              メールアドレスを変更しました
            </h1>
            <p className="mt-4 text-sm text-text-secondary text-center">
              メールアドレスの変更が完了しました。
            </p>
            <div className="mt-8">
              <Link
                href="/users/me"
                className="block w-full py-3 text-sm text-text-body text-center border border-border rounded-lg hover:bg-surface-hover transition"
              >
                ユーザー詳細に戻る
              </Link>
            </div>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-xl font-bold text-text-body text-center">
              変更に失敗しました
            </h1>
            <p className="mt-4 text-sm text-text-secondary text-center">
              リンクが無効か期限切れです。再度メールアドレスの変更をお試しください。
            </p>
            <div className="mt-8">
              <Link
                href="/users/email/edit"
                className="block w-full py-3 text-sm text-text-body text-center border border-border rounded-lg hover:bg-surface-hover transition"
              >
                メールアドレス変更に戻る
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
