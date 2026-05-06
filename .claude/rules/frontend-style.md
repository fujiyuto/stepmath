---
paths:
  - "frontend/src/**/*.tsx
---

## スタイル規約
- カラーは必ず`globals.css`の`@theme`で定義したテーマカラーを使うこと
- 直接カラーコード（`#4F46E5`など）をクラスに書かない
- 例：`text-primary`、`bg-base`
- フォントサイズはTailwindのデフォルトユーティリティ（`text-sm`、`text-base`、`text-lg`など）を使うこと。任意の数値（`text-[14px]`など）は使わない