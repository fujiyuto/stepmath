"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "パスワードは8文字以上で入力してください"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

type PasswordFormErrors = Partial<
  z.ZodFlattenedError<z.infer<typeof passwordSchema>>["fieldErrors"]
>;

/**
 * パスワード変更フォームコンポーネント。
 * 新しいパスワードを入力してSupabase Auth経由で更新する。
 * @returns パスワード変更フォーム
 */
export default function PasswordEditForm() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<PasswordFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const supabase = createClient();

  /**
   * フォーム送信ハンドラー。バリデーション後にSupabaseへパスワード変更リクエストを送る。
   * @param e - フォームイベント
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    const result = passwordSchema.safeParse({ newPassword, confirmPassword });
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Supabase Auth でパスワードを更新
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        setApiError(error.message);
        return;
      }
      router.push("/users/password/edit/complete");
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "パスワードの変更に失敗しました"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
      <Input
        type="password"
        placeholder="新しいパスワード（8文字以上）"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={errors.newPassword?.[0]}
      />
      <Input
        type="password"
        placeholder="新しいパスワード（確認）"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword?.[0]}
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
          disabled={isLoading}
          loadingText="変更中..."
          className="flex-1 py-3 bg-primary hover:bg-primary-dark disabled:bg-primary-light text-white text-sm font-medium rounded-lg transition"
        >
          変更
        </Button>
      </div>
    </form>
  );
}
