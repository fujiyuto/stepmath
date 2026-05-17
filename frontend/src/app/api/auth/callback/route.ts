import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { api } from "@/lib/api";

type UserGetResponse = {
    username: string
}

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)

    // アクセストークン交換用のcodeを取得
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        // codeの交換ができた場合
        if ( !error ) {
            // ユーザープロフィールが登録済みか確認
            const { ok } = await api.get<UserGetResponse>("/users/me", data.session.access_token)

            // 登録済みならフラグをtrue
            if ( ok ) {
                await supabase.auth.updateUser({ data: { profile_completed: true } })
            }    

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            const next = ok ? '/home' : '/users/me/setup'
            if (isLocalEnv) {
                // ローカル開発環境の場合
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }

    }
    
    // エラーありの場合、エラー画面にリダイレクト
    return NextResponse.redirect(`${origin}/auth-code-error`)
}