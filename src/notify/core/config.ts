import { NotifyInternal, NotifyButtonInternal } from "../types";

/** 預設通知參數 */
export const DEFAULT_NOTIFY = {
  id: "",
  title: null,
  message: "",
  buttons: [],
  options: { cancelable: true },
} satisfies NotifyInternal;

type DefaultButton = Required<Omit<NotifyButtonInternal, "onClick">>;
/** 預設確認按鈕 */
export const CONFIRM_BUTTON: DefaultButton = {
  id: "confirm",
  text: "確定",
  style: "default",
};
/** 預設取消按鈕 */
export const CANCEL_BUTTON: DefaultButton = {
  id: "cancel",
  text: "取消",
  style: "cancel",
};
