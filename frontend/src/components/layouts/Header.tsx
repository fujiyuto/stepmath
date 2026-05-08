"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

/**
 * アプリ全体に固定表示するヘッダーコンポーネント。
 * 認証状態に応じてログアウトボタンまたはログイン・新規登録ボタンを表示する。
 * @returns ヘッダー要素
 */
export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 初期セッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 認証状態の変化を購読
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * ログアウト処理。Supabaseのセッションを削除しサインインページへ遷移する。
   */
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/users/signin");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="text-primary font-bold text-3xl">
          Enthink
        </Link>

        <nav className="flex items-center gap-3">
          {session ? (
            <Button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer"
            >
              ログアウト
            </Button>
          ) : (
            <>
              <Link
                href="/users/signin"
                className="px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-surface-hover transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/users/signup"
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                新規登録
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
