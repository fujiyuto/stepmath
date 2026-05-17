const SUPABASE_ERROR_MESSAGES: Record<string,string> = {
    user_already_exists: "このメールアドレスはすでに登録されています",
    
}

const DEFAULT_ERROR_MESSAGE = "エラーが発生しました。しばらく時間をおいてから再試行してください。"

export {
    SUPABASE_ERROR_MESSAGES,
    DEFAULT_ERROR_MESSAGE
}