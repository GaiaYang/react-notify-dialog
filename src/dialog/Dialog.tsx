import type { ComponentProps } from "react";

export type DialogProps = ComponentProps<"dialog">;

/** 無樣式 `<dialog>`，headless 基底 */
export default function Dialog(props: DialogProps) {
  return <dialog {...props} />;
}
