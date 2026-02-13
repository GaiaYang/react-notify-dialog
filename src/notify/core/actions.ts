import type { Notify, NotifyButton, NotifyButtonInternal } from "../types";

import { store } from "./store";
import generateId from "./generateId";
import { CONFIRM_BUTTON, CANCEL_BUTTON } from "./config";

export const notify = {
  /** 顯示 alert 通知，帶標題與訊息 */
  alert(
    title: Notify["title"],
    message?: Notify["message"],
    buttons?: Notify["buttons"],
  ): string {
    const id = generateId();
    store.dispatch({
      type: "ADD",
      payload: {
        id,
        title,
        message,
        buttons: attachIdsToButtons(buttons),
      },
    });
    return id;
  },
  /** 顯示簡單訊息通知 */
  message(message: Notify["message"], title?: Notify["title"]): string {
    const id = generateId();
    store.dispatch({
      type: "ADD",
      payload: {
        id,
        title: title ?? null,
        message,
        buttons: [CONFIRM_BUTTON],
      },
    });
    return id;
  },
  confirm(
    message: Notify["message"],
    onConfirm?: NotifyButton["onClick"],
    onCancel?: NotifyButton["onClick"],
    title?: Notify["title"],
  ) {
    const id = generateId();
    store.dispatch({
      type: "ADD",
      payload: {
        id,
        title: title ?? null,
        message,
        buttons: [
          { ...CANCEL_BUTTON, onClick: onCancel },
          { ...CONFIRM_BUTTON, onClick: onConfirm },
        ],
      },
    });
    return id;
  },
  confirmAsync(message: Notify["message"], title?: Notify["title"]) {
    const id = generateId();
    return new Promise<boolean>((resolve) => {
      store.dispatch({
        type: "ADD",
        payload: {
          id,
          title: title ?? null,
          message,
          buttons: [
            {
              ...CANCEL_BUTTON,
              onClick: () => {
                resolve(false);
              },
            },
            {
              ...CONFIRM_BUTTON,
              onClick: () => {
                resolve(true);
              },
            },
          ],
        },
      });
    });
  },
  /** 關閉通知 */
  dismiss(id: string) {
    store.dispatch({ type: "REMOVE", payload: { id } });
  },
};

/** 為按鈕組的物件新增 ID */
function attachIdsToButtons(
  buttons?: NotifyButton[],
): NotifyButtonInternal[] | undefined {
  return buttons?.map((item) => ({ ...item, id: generateId() }));
}
