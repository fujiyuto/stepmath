import React from "react";

type Props = React.ComponentPropsWithoutRef<"input"> & {
  /** バリデーションエラーメッセージ */
  error?: string;
};

/**
 * 汎用入力欄コンポーネント。エラーメッセージ表示を内包する。
 * @param error - フィールドエラーメッセージ
 * @returns ラベルとエラーを含む入力欄
 */
export default function Input({ error, className, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <input
        className={`w-full px-4 py-3 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-ring focus:border-transparent transition ${className ?? ""}`}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
