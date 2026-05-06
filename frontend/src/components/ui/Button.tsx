import React from "react";

type Props = React.ComponentPropsWithoutRef<"button"> & {
  /** ローディング状態フラグ */
  isLoading?: boolean;
  /** ローディング中に表示するテキスト */
  loadingText?: string;
};

/**
 * 汎用ボタンコンポーネント。ローディング状態を管理できる。
 * @param isLoading - ローディング状態フラグ
 * @param loadingText - ローディング中に表示するテキスト
 * @returns ボタン要素
 */
export default function Button({ isLoading, loadingText, children, disabled, className, ...props }: Props) {
  return (
    <button
      disabled={disabled ?? isLoading}
      className={className}
      {...props}
    >
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}
