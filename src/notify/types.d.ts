import type { DOMAttributes } from "react";

/**
 * 按鈕樣式
 *
 * - `default` 預設按鈕樣式
 * - `cancel` 取消按鈕樣式
 * - `destructive` 警告按鈕樣式
 */
export type NotifyButtonStyle = "default" | "cancel" | "destructive";

/** 通知按鈕 */
export interface NotifyButton {
  /** 按鈕文本 */
  text: string;
  /** 按鈕點擊事件 */
  onClick?: DOMAttributes<HTMLButtonElement>["onClick"];
  /** 按鈕樣式 */
  style?: NotifyButtonStyle;
}

/** 通知 */
export interface Notify {
  /** 通知標題 */
  title: string;
  /** 通知內容 */
  message: string;
  /** 通知按鈕 */
  buttons?: NotifyButton[];
}

// 功能內部使用型別
/** 內部使用的通知按鈕，包含 id */
export interface NotifyButtonInternal extends NotifyButton {
  /** 按鈕 id */
  id: string;
}

/** 內部使用的通知，包含 id */
export interface NotifyInternal extends Omit<Notify, "buttons"> {
  /** 通知 id */
  id: string;
  /** 通知按鈕 */
  buttons?: NotifyButtonInternal[];
}
