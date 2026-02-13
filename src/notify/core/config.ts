import { NotifyButtonInternal } from "../types";

/** 預設通知標題 */
export const DEFAULT_TITLE = "通知";

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
