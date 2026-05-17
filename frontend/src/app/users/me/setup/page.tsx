"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type SetupResponse = {
    message: string;
};

const setupSchema = z.object({
    username: z
        .string()
        .min(3, "ユーザー名は3〜30文字で入力してください")
        .max(30, "ユーザー名は3〜30文字で入力してください")
        .regex(/^[a-zA-Z0-9_]+$/, "ユーザー名は半角英数字とアンダースコアのみ使用できます"),
});

/**
 * Google登録後のプロフィール設定ページ。
 * ユーザー名を入力してバックエンドにユーザーレコードを登録する。
 * @returns プロフィール設定フォーム
 */
export default function UserMeSetupPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [usernameError, setUsernameError] = useState<string | undefined>(undefined);
    const [apiError, setApiError] = useState<string | null>(null);

    /**
     * フォーム送信ハンドラー。バリデーション後にバックエンドへユーザー登録する。
     * @param e - フォームイベント
     * @returns なし
     */
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUsernameError(undefined);
        setApiError(null);

        const result = setupSchema.safeParse({ username });
        if (!result.success) {
            setUsernameError(z.flattenError(result.error).fieldErrors.username?.[0]);
            return;
        }

        setIsLoading(true);

        // セッションからアクセストークンを取得
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setApiError("セッションが見つかりません。再度ログインしてください。");
            setIsLoading(false)
            return;
        }

        // username登録
        const { ok } = await api.post<SetupResponse>("/users/", { username }, session.access_token);

        if ( !ok ) {
            setApiError("登録に失敗しました")
            setIsLoading(false)
            return;
        }

        // プロフィール登録フラグ更新
        await supabase.auth.updateUser({ data: { profile_completed: true }})

        router.push("/home");
    };

    return (
        <main className="min-h-screen pt-24 bg-page-bg">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md px-10 py-12">
                <h1 className="text-2xl font-bold text-text-body text-center">プロフィール設定</h1>
                <p className="mt-2 text-sm text-text-secondary text-center">
                    サービスで使用するユーザー名を設定してください
                </p>

                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
                    <Input
                        type="text"
                        placeholder="ユーザー名（半角英数字・アンダースコア）"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={usernameError}
                    />

                    {apiError && (
                        <p className="text-sm text-error text-center">{apiError}</p>
                    )}

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        loadingText="登録中..."
                        className="mt-2 w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-primary-light text-white text-sm font-medium rounded-lg transition"
                    >
                        登録する
                    </Button>
                </form>
            </div>
        </main>
    );
}
