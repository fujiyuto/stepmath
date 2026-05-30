import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // 未ログインの場合、singin画面にリダイレクト
  if (!user) {
    return NextResponse.redirect(new URL("/users/signin", request.url));
  }

  // 認証済みだがプロフィールの入力が未完了（setup 画面自体は除外）
  if (!user.user_metadata.profile_completed && pathname !== "/users/me/setup") {
    return NextResponse.redirect(new URL("/users/me/setup", request.url));
  }

  return response;
}

export const config = {
  // /、/users/signin、/users/signup、/api/auth/*、/auth-code-error を除く全パスに適用
  matcher: [
    "/((?!users/signin|users/signup|api/auth|auth-code-error|_next/static|_next/image|favicon\\.ico).+)",
  ],
};
