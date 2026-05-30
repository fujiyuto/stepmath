"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import PasswordEditEmailSendButton from "@/components/features/PasswordEdit/PasswordEditEmailSendButton";

type UserGetResponse = {
  username: string;
};

type UserState = UserGetResponse & { email: string };

type UserProblemInfoResponse = {
  total_count: number;
  by_field: { label: string; count: number }[];
};

/**
 * ユーザー詳細画面。基本情報・学習統計・アカウント操作を表示する。
 * @returns ユーザー詳細ページ
 */
export default function UserMePage() {
  const [user, setUser] = useState<UserState | null>(null);
  const [problemInfo, setProblemInfo] =
    useState<UserProblemInfoResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [provider, setProvider] = useState<string>();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // セッションからトークンを取得してユーザー情報・学習統計を並列取得
    const initFunc = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/users/signin");
        return;
      }
      const [userData, problemData] = await Promise.all([
        api.get<UserGetResponse>("/users/me", session.access_token),
        api.get<UserProblemInfoResponse>("/problems/me", session.access_token),
      ]);

      if (!userData.ok || !problemData.ok) {
        setFetchError("情報の取得に失敗しました");
        return;
      }
      // emailはSupabase Authのセッションから取得
      setUser({ ...userData.result, email: session.user.email ?? "" });
      setProblemInfo(problemData.result);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setProvider(user?.app_metadata.provider ?? "");
    };

    initFunc();
  }, []);

  /**
   * 退会処理。確認後にユーザーを削除してトップへ遷移する。
   */
  const handleDeleteAccount = async () => {
    if (!window.confirm("本当に退会しますか？この操作は取り消せません。"))
      return;

    setIsDeleting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await api.delete("/users/me", session?.access_token);
      await supabase.auth.signOut();
      router.push("/users/signup");
    } finally {
      setIsDeleting(false);
    }
  };

  if (fetchError) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-error text-sm">{fetchError}</p>
      </div>
    );
  }

  if (!user || !problemInfo) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-secondary text-sm">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* 基本情報 */}
      <section className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
          基本情報
        </h2>
        <dl className="space-y-3">
          <div className="flex justify-between items-center">
            <dt className="text-sm text-text-secondary">ユーザー名</dt>
            <dd className="text-sm font-medium text-text-body">
              {user.username}
            </dd>
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
            <dt className="text-sm text-text-secondary">作成した問題数</dt>
            <dd className="text-sm font-medium text-text-body">
              {problemInfo.total_count} 問
            </dd>
          </div>
          {problemInfo.by_field.map(({ label, count }) => (
            <div key={label} className="flex justify-between items-center">
              <dt className="text-sm text-text-secondary pl-4">{label}</dt>
              <dd className="text-sm font-medium text-text-body">{count} 問</dd>
            </div>
          ))}
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
        <Link
          href="/users/email/edit"
          className="flex justify-between items-center w-full px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <span className="text-sm text-text-body">メールアドレス変更</span>
          <span className="text-text-tertiary">→</span>
        </Link>

        {/** パスワード変更ダイアログ */}
        <PasswordEditEmailSendButton />

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
  );
}
