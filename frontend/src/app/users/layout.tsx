/**
 * ユーザー関連ページの共通レイアウト。
 * @param children - 子コンポーネント
 * @returns 共通スタイルを適用したラッパー
 */
export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-page-bg pt-24">{children}</div>;
}
