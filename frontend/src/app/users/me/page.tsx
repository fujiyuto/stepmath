"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";

type UserGetResponse = {
  email: string;
  username: string;
};

/**
 * ユーザー詳細画面。基本情報・学習統計・アカウント操作を表示する。
 * @returns ユーザー詳細ページ
 */
export default function UserMePage() {
  const [user, setUser] = useState<UserGetResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // セッションからトークンを取得してユーザー情報を取得
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push("/users/signin");
        return;
      }
      const data = await api.get<UserGetResponse>("/users/me", session.access_token);
      setUser(data);
    });
  }, []);

  /**
   * 退会処理。確認後にユーザーを削除してトップへ遷移する。
   */
  const handleDeleteAccount = async () => {
    if (!window.confirm("本当に退会しますか？この操作は取り消せません。")) return;

    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await api.delete("/users/me", session?.access_token);
      await supabase.auth.signOut();
      router.push("/users/signup");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-page-bg flex items-center justify-center">
        <p className="text-text-secondary text-sm">読み込み中...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-page-bg py-10 px-4">
      <div className="max-w-lg mx-auto space-y-4">
        <h1 className="text-xl font-bold text-text-body">ユーザー詳細</h1>

        {/* 基本情報 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            基本情報
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between items-center">
              <dt className="text-sm text-text-secondary">ユーザー名</dt>
              <dd className="text-sm font-medium text-text-body">{user.username}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-sm text-text-secondary">メールアドレス</dt>
              <dd className="text-sm font-medium text-text-body">{user.email}</dd>
            </div>
          </dl>
        </section>

        {/* 学習統計 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            学習統計
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between items-center">
              <dt className="text-sm text-text-secondary">解いた問題数</dt>
              <dd className="text-sm text-text-tertiary">準備中</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-sm text-text-secondary">解いた分野の内訳</dt>
              <dd className="text-sm text-text-tertiary">準備中</dd>
            </div>
          </dl>
        </section>

        {/* アカウント操作 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 space-y-2">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
            アカウント操作
          </h2>
          <Link
            href="/users/me/edit"
            className="flex justify-between items-center w-full px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <span className="text-sm text-text-body">プロフィール編集</span>
            <span className="text-text-tertiary">→</span>
          </Link>
          <Button
            onClick={handleDeleteAccount}
            isLoading={isDeleting}
            loadingText="退会処理中..."
            className="flex justify-between items-center w-full px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <span className="text-sm text-error">退会</span>
            <span className="text-error">→</span>
          </Button>
        </section>
      </div>
    </main>
  );
}
