"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type Props = {
  /** LaTeX形式の数式文字列 */
  latex: string;
  /** インライン表示するかどうか（デフォルト: false = ブロック表示） */
  inline?: boolean;
};

/**
 * LaTeX形式の数式をKaTeXでレンダリングするコンポーネント。
 * @param latex - LaTeX形式の数式文字列
 * @param inline - インライン表示フラグ
 */
export default function MathRenderer({ latex, inline = false }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    katex.render(latex, ref.current, {
      throwOnError: false,
      displayMode: !inline,
    });
  }, [latex, inline]);

  return <span ref={ref} />;
}
