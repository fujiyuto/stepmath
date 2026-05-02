/**
 * チャットページ（数学問題を解くインターフェース）。
 */
export default function ChatPage() {
  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">問題を解く</h1>

      {/* メッセージ表示エリア */}
      <div className="flex-1 overflow-y-auto space-y-4 rounded-xl border border-gray-200 p-4 mb-4">
        <p className="text-gray-400 text-sm text-center">問題が表示されます</p>
      </div>

      {/* 入力エリア */}
      <form className="flex gap-2">
        <input
          type="text"
          placeholder="解答を入力..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          送信
        </button>
      </form>
    </main>
  );
}
