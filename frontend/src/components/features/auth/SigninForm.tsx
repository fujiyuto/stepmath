"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const signinSchema = z.object({
  email: z.email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

type SigninFormErrors = Partial<
  z.ZodFlattenedError<z.infer<typeof signinSchema>>["fieldErrors"]
>;

/**
 * ログインフォームコンポーネント。
 * Supabase Auth でメール・パスワード認証を行う。
 * @returns ログインフォーム
 */
export default function SigninForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SigninFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  /**
   * フォーム送信ハンドラー。バリデーション後に Supabase Auth でログインする。
   * @param e - フォームイベント
   * @returns なし
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    const result = signinSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setApiError("メールアドレスまたはパスワードが正しくありません");
        return;
      }

      router.push("/home");
    } catch {
      setApiError("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
      <Input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email?.[0]}
      />
      <Input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password?.[0]}
      />

      {apiError && <p className="text-sm text-error text-center">{apiError}</p>}

      <Button
        type="submit"
        isLoading={isLoading}
        loadingText="ログイン中..."
        className="mt-2 w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-primary-light text-white text-sm font-medium rounded-lg transition"
      >
        ログイン
      </Button>
    </form>
  );
}
