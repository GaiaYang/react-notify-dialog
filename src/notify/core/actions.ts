import type {
  Notify,
  NotifyButton,
  NotifyButtonInternal,
  NotifyInternal,
} from "../types";

import { store } from "./store";
import generateId from "./generateId";
import { CONFIRM_BUTTON, CANCEL_BUTTON, DEFAULT_NOTIFY } from "./config";

/** 通知 */
export const notify = {
  /** 顯示 alert 通知，帶標題與訊息 */
  alert(
    title: Notify["title"],
    message?: Notify["message"],
    buttons?: Notify["buttons"],
    options?: Notify["options"],
  ): string {
    const id = generateId();
    store.dispatch({
      type: "ADD",
      payload: createNotify({
        id,
        title,
        message,
        buttons,
        options,
      }),
    });
    return id;
  },
  /** 顯示簡單訊息通知 */
  message(message: Notify["message"], title?: Notify["title"]): string {
    const id = generateId();
    store.dispatch({
      type: "ADD",
      payload: createNotify({
        id,
        title,
        message,
        buttons: [{ ...CONFIRM_BUTTON }],
      }),
    });
    return id;
  },
  /** 顯示確認通知 */
  confirm(
    message: Notify["message"],
    onConfirm?: NotifyButton["onClick"],
    onCancel?: NotifyButton["onClick"],
    title?: Notify["title"],
  ) {
    const id = generateId();
    store.dispatch({
      type: "ADD",
      payload: createNotify({
        id,
        title,
        message,
        buttons: [
          { ...CANCEL_BUTTON, onClick: onCancel },
          { ...CONFIRM_BUTTON, onClick: onConfirm },
        ],
      }),
    });
    return id;
  },
  /** 顯示非同步確認通知 */
  confirmAsync(message: Notify["message"], title?: Notify["title"]) {
    const id = generateId();
    return new Promise<boolean>((resolve) => {
      store.dispatch({
        type: "ADD",
        payload: createNotify({
          id,
          title,
          message,
          buttons: [
            {
              ...CANCEL_BUTTON,
              onClick() {
                resolve(false);
              },
            },
            {
              ...CONFIRM_BUTTON,
              onClick() {
                resolve(true);
              },
            },
          ],
        }),
      });
    });
  },
  /** 關閉通知 */
  dismiss(id: string) {
    store.dispatch({ type: "REMOVE", payload: { id } });
  },
};

/** 建立完整的通知物件 */
function createNotify(
  payload: Partial<Notify> & Pick<NotifyInternal, "id">,
): NotifyInternal {
  return {
    ...DEFAULT_NOTIFY,
    ...payload,
    buttons:
      payload.buttons?.map((item) => ({
        ...item,
        id: (item as unknown as NotifyButtonInternal).id || generateId(),
      })) ?? DEFAULT_NOTIFY.buttons,
    options: { ...DEFAULT_NOTIFY.options, ...payload.options },
  };
}
