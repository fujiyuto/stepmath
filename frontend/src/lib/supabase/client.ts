import { createBrowserClient } from "@supabase/ssr";

/**
 * クライアントコンポーネント向け Supabase ブラウザクライアントを生成する。
 * @returns Supabase クライアント
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
