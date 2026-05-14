import Link from "next/link";
import SigninForm from "@/components/features/auth/SigninForm";
import GoogleSigninButton from "@/components/features/auth/GoogleSigninButton";

/**
 * ログインページ。
 * @returns ログインフォームを含むページ
 */
export default function SigninPage() {
    return (
        <main className="min-h-screen pt-24 bg-page-bg">
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md px-10 py-12">
                {/* ロゴ・サービス説明 */}
                <h1 className="text-3xl font-bold text-primary text-center tracking-tight">
                Enthink
                </h1>
                <p className="mt-2 text-sm text-text-secondary text-center">
                思考の言語化を通じて、数学的思考力を鍛えるEdTechサービス
                </p>

                <SigninForm />

                {/* 区切り */}
                <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-text-tertiary">または</span>
                <div className="flex-1 h-px bg-border" />
                </div>

                <GoogleSigninButton
                    mode="signin"
                />

                {/* サインアップリンク */}
                <p className="mt-6 text-sm text-text-secondary text-center">
                アカウントをお持ちでない方は{" "}
                <Link href="/users/signup" className="text-primary hover:underline">
                    こちら
                </Link>
                </p>
            </div>
        </main>
    );
}
