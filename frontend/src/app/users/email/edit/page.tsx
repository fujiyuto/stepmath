import EmailEditForm from "@/components/features/auth/EmailEditForm";

/**
 * メールアドレス変更入力ページ。
 * @returns 新しいメールアドレスを入力するページ
 */
export default function UserEmailEditPage() {
  return (
    <div className="w-lg mx-auto bg-white rounded-2xl shadow-sm px-10 py-12">
      <h1 className="text-xl font-bold text-text-body text-center">
        メールアドレスの変更
      </h1>

      <EmailEditForm />
    </div>
  );
}
