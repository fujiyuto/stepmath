"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Dialog } from "radix-ui";
import { Cross1Icon } from "@radix-ui/react-icons";
import { createClient } from "@/lib/supabase/client";

export default function PasswordEditEmailSendButton() {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [apiError, setApiError] = useState<string | null>(null);

  const supabase = createClient();

  // パスワード変更用メール送信ボタン押下時処理
  const handleSendEmailButton = async () => {
    setIsLoading(true)

    const { data } = await supabase.auth.getSession();

    // セッション情報取得に失敗した場合
    if (!data.session || !data.session.user.email) {
      setApiError(
        "エラーが発生しました。しばらく時間をおいてもう一度お試しください。"
      );
      return;
    }

    // メールアドレスをセッションから取得
    const email = data.session.user.email;

    // パスワード変更メール送信
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/users/password/edit`,
    });

    // 変更メール送信にエラーがあった場合
    if (error) {
      setApiError(error.message);
      setIsLoading(false)
      return;
    }

    // ローディングを表現するために少し時間置く
    setTimeout(() => {
      setIsLoading(false)
      setIsSending(true)
    }, 1000)
  };

  /**
   * ダイアログ開閉時の処理
   * @param open - 開閉フラグ
   */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsLoading(false)
      setIsSending(false)
      setApiError(null)
    }
  }

  return (
    <>
      <Dialog.Root onOpenChange={handleOpenChange}>
        <Dialog.Trigger asChild>
          <button className="flex justify-between items-center w-full px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer">
            <span className="text-sm text-text-body">パスワード変更</span>
            <span className="text-text-tertiary">→</span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed z-20 opacity-70 bg-neutral-900 inset-0 animate-show-overlay"/>
          <Dialog.Content
            className="fixed z-20 bg-white min-w-md h-36 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-8 rounded-lg flex flex-col justify-center"
            onInteractOutside={(e) => e.preventDefault()}
          > 
            {
              isSending ? (
                <Dialog.Title className="text-sm text-center my-auto">
                  メールを送信しました
                </Dialog.Title>
              ) : (
                <>
                  <Dialog.Title className="text-sm text-center">
                    登録したメールアドレスにパスワード変更メールを送信します
                  </Dialog.Title>

                  {/** エラーメッセージ */}
                  <p className="text-error">{apiError}</p>


                  <Button
                    type="button"
                    className="px-4 py-2 mt-4 w-full rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors cursor-pointer"
                    onClick={handleSendEmailButton}
                    disabled={isLoading}
                    isLoading={isLoading}
                  >
                    メールを送信
                  </Button>
                </>
              ) 
            }
            <Dialog.Close asChild>
              <div className="z-20 absolute top-3 right-3 cursor-pointer ">
                <Cross1Icon />
              </div>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
