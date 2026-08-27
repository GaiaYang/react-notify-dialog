import type { Notify, NotifyButton, NotifyInternal } from "./types";

import { store } from "./store";
import { CONFIRM_BUTTON, CANCEL_BUTTON, DEFAULT_NOTIFY } from "./constants";
import generateId from "./utils/generateId";

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
  /** 顯示非同步確認通知；Esc / dismiss 視為取消（false） */
  confirmAsync(message: Notify["message"], title?: Notify["title"]) {
    const id = generateId();
    return new Promise<boolean>((resolve) => {
      let settled = false;
      const settle = (value: boolean) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };

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
                settle(false);
              },
            },
            {
              ...CONFIRM_BUTTON,
              onClick() {
                settle(true);
              },
            },
          ],
          onDismiss() {
            settle(false);
          },
        }),
      });
    });
  },
  /** 關閉通知 */
  dismiss(id: string) {
    const target = store.getSnapshot().notifies.find((n) => n.id === id);
    if (!target) return;

    store.dispatch({ type: "REMOVE", payload: { id } });
    target.onDismiss?.();
  },
};

/** 建立完整的通知物件 */
function createNotify(
  payload: Partial<Notify> &
    Pick<NotifyInternal, "id"> &
    Pick<Partial<NotifyInternal>, "onDismiss">,
): NotifyInternal {
  return {
    ...DEFAULT_NOTIFY,
    ...payload,
    buttons:
      payload.buttons?.map((item) => ({
        ...item,
        id: item.id || generateId(),
      })) ?? DEFAULT_NOTIFY.buttons,
    options: { ...DEFAULT_NOTIFY.options, ...payload.options },
  };
}
