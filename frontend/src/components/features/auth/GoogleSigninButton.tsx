"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

type Props = {
    mode: "signup" | "signin"
}

/**
 * GoogleOAuthでのサインインボタン。
 * @param label - ボタンに表示するアクション名（例：「ログイン」「登録」）
 * @returns Googleアイコン付きのサインインボタン
 */
export default function GoogleSigninButton({ mode }: Props) {
    const [apiError, setApiError] = useState<string | null>(null);

    /**
     * GoogleOAuthでのサインイン処理。
     * @returns なし
     */
    const handleSigninWithGoogle = async () => {
        setApiError(null);
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`
            }
        });

        if (error) {
            setApiError("Googleログインに失敗しました");
        }
    };

    return (
        <>
            <Button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-lg text-sm text-text-body hover:bg-surface-hover transition cursor-pointer"
                onClick={handleSigninWithGoogle}
            >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                    fill="#4285F4"
                    />
                    <path
                    d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                    fill="#34A853"
                    />
                    <path
                    d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                    fill="#FBBC05"
                    />
                    <path
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.169 6.656 3.58 9 3.58z"
                    fill="#EA4335"
                    />
                </svg>
                GOOGLEアカウントで{mode === "signin" ? "ログイン" : "登録"}
            </Button>
            {apiError && (
                <p className="mt-2 text-sm text-error text-center">{apiError}</p>
            )}
        </>
    );
}