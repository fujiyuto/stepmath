"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  SUPABASE_ERROR_MESSAGES,
  DEFAULT_ERROR_MESSAGE,
} from "../../../../constants/messages";

const signupSchema = z.object({
  email: z.email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

type SignupFormErrors = Partial<
  z.ZodFlattenedError<z.infer<typeof signupSchema>>["fieldErrors"]
>;

/**
 * ユーザー登録フォームコンポーネント。
 * Supabase Auth でユーザーを作成し、プロフィール設定画面へ遷移する。
 * @returns 登録フォーム
 */
export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  /**
   * フォーム送信ハンドラー。バリデーション後に Supabase Auth でユーザーを登録する。
   * @param e - フォームイベント
   * @returns なし
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    const parseResult = signupSchema.safeParse({ email, password });
    if (!parseResult.success) {
      setErrors(z.flattenError(parseResult.error).fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setApiError(
          (error.code && SUPABASE_ERROR_MESSAGES[error.code]) ??
            DEFAULT_ERROR_MESSAGE
        );
        return;
      }

      router.push("/users/me/setup");
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
        loadingText="登録中..."
        className="mt-2 w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-primary-light text-white text-sm font-medium rounded-lg transition"
      >
        新規登録
      </Button>
    </form>
  );
}
