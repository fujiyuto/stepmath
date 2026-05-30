import PasswordEditForm from "@/components/features/auth/PasswordEditForm";

/**
 * パスワード変更入力ページ。
 * @returns 新しいパスワードを入力するページ
 */
export default function UserPasswordEditPage() {
  return (
    <div className="w-lg mx-auto bg-white rounded-2xl shadow-sm px-10 py-12">
      <h1 className="text-xl font-bold text-text-body text-center">
        パスワードの変更
      </h1>

      <PasswordEditForm />
    </div>
  );
}
