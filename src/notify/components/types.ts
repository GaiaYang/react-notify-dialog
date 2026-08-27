import type {
  ComponentPropsWithoutRef,
  ComponentType,
  Ref,
} from "react";

import type { NotifyButtonStyle } from "../types";

/** 可替換的通知按鈕 props */
export type NotifierButtonProps = ComponentPropsWithoutRef<"button"> & {
  buttonStyle?: NotifyButtonStyle;
  ref?: Ref<HTMLButtonElement>;
};

/** 可傳入 `<Notifier components={...} />` 覆寫的 UI 組件 */
export interface NotifierComponents {
  /** `<dialog>` 容器 */
  Dialog: ComponentType<
    ComponentPropsWithoutRef<"dialog"> & { ref?: Ref<HTMLDialogElement> }
  >;
  /** 內容區塊 */
  Content: ComponentType<ComponentPropsWithoutRef<"div">>;
  /** 標題 */
  Title: ComponentType<ComponentPropsWithoutRef<"h2">>;
  /** 訊息 */
  Description: ComponentType<ComponentPropsWithoutRef<"p">>;
  /** 按鈕列 */
  Footer: ComponentType<ComponentPropsWithoutRef<"div">>;
  /** 按鈕 */
  Button: ComponentType<NotifierButtonProps>;
}
