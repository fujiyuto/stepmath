"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const emailSchema = z.object({
  email: z.email("有効なメールアドレスを入力してください"),
});

type EmailFormErrors = Partial<
  z.ZodFlattenedError<z.infer<typeof emailSchema>>["fieldErrors"]
>;

/**
 * メールアドレス変更フォームコンポーネント。
 * 新しいメールアドレスを入力してSupabase Auth経由で確認メールを送信する。
 * @returns メールアドレス変更フォーム
 */
export default function EmailEditForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<EmailFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // 未ログインの場合はサインイン画面へリダイレクト、ログイン済みなら現在のemailを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/users/signin");
      setCurrentEmail(session?.user.email ?? "");
    });
  }, []);

  /**
   * フォーム送信ハンドラー。バリデーション後にSupabaseへメールアドレス変更リクエストを送る。
   * @param e - フォームイベント
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    if (email === currentEmail) {
      setErrors({ email: ["現在と同じメールアドレスは設定できません"] });
      return;
    }

    setIsLoading(true);
    try {
      // Supabase Auth に新しいメールアドレスへの確認メール送信を依頼
      const { error } = await supabase.auth.updateUser(
        { email },
        {
          emailRedirectTo: `${window.location.origin}/users/email/edit/complete`,
        }
      );
      if (error) {
        setApiError(error.message);
        return;
      }
      router.push("/users/email/edit/confirm");
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : "メールアドレスの変更に失敗しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
      <Input
        type="email"
        placeholder="新しいメールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email?.[0]}
      />

      {apiError && <p className="text-sm text-error text-center">{apiError}</p>}

      <div className="mt-2 flex gap-3">
        <Link
          href="/users/me"
          className="flex-1 py-3 border border-border rounded-lg text-sm text-text-body text-center hover:bg-surface-hover transition"
        >
          キャンセル
        </Link>
        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="送信中..."
          className="flex-1 py-3 bg-primary hover:bg-primary-dark disabled:bg-primary-light text-white text-sm font-medium rounded-lg transition"
        >
          保存
        </Button>
      </div>
    </form>
  );
}
