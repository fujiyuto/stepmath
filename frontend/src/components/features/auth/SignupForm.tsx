"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type SignupResponse = {
  message: string;
};

const signupSchema = z.object({
  username: z
    .string()
    .min(3, "ユーザー名は3〜30文字で入力してください")
    .max(30, "ユーザー名は3〜30文字で入力してください")
    .regex(/^[a-zA-Z0-9_]+$/, "ユーザー名は半角英数字とアンダースコアのみ使用できます"),
  email: z.email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

type SignupFormErrors = Partial<z.ZodFlattenedError<z.infer<typeof signupSchema>>["fieldErrors"]>;

/**
 * ユーザー登録フォームコンポーネント。
 * Supabase Auth でユーザーを作成し、JWTを使ってバックエンドにユーザーレコードを登録する。
 * @returns 登録フォーム
 */
export default function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  /**
   * フォーム送信ハンドラー。バリデーション → Supabase Auth登録 → バックエンド登録の順で処理する。
   * @param e - フォームイベント
   * @returns なし
   */
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    const result = signupSchema.safeParse({ username, email, password });
    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    try {
      // Supabase Auth にユーザーを登録
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setApiError(error.message);
        return;
      }

      // メール確認が必要な場合
      if (!data.session) {
        setApiError("登録確認メールを送信しました。メールを確認してください。");
        return;
      }

      // バックエンドにユーザーレコードを登録
      const token = data.session.access_token;
      try {
        await api.post<SignupResponse>("/users/", { username }, token);
      } catch (err) {
        // FastAPI登録失敗 → クライアント側セッションを破棄
        await supabase.auth.signOut();
        setApiError(err instanceof Error ? err.message : "登録に失敗しました");
        return;
      }

      router.push("/home");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "登録に失敗しました");
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
      <Input
        type="text"
        placeholder="ユーザー名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={errors.username?.[0]}
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
  );
}
