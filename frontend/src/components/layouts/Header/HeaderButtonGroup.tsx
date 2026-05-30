"use client";

import type { Session } from "@supabase/supabase-js";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  session: Session | null | undefined;
};

export default function HeaderButtonGroup({ session }: Props) {
  const supabase = createClient();
  const router = useRouter();

  /**
   * ログアウト処理。Supabaseのセッションを削除しサインインページへ遷移する。
   */
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/users/signin");
  };

  if (session === undefined) return null;

  return session ? (
    <>
      <Button
        onClick={handleSignOut}
        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer"
      >
        ログアウト
      </Button>
      <Link
        href="/users/me"
        className="p-2 rounded-lg text-primary hover:text-primary-dark transition-colors"
        aria-label="マイページ"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </Link>
    </>
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
  );
}
