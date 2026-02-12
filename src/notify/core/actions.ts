import type { Notify } from "../types";
import { store } from "./store";
import generateId from "./generateId";

export const DEFAULT_CLOSE_ID = "default_close";

export const notify = {
  /** 顯示 alert 通知，帶標題與訊息 */
  alert(
    title: Notify["title"],
    message: Notify["message"],
    buttons?: Notify["buttons"],
  ): string {
    const id = generateId();
    store.addNotify({
      id,
      title,
      message,
      buttons: buttons?.map((item) => ({ ...item, id: generateId() })),
    });
    return id;
  },

  /** 顯示簡單訊息通知，沒有標題 */
  message(message: Notify["message"], buttons?: Notify["buttons"]): string {
    const id = generateId();
    store.addNotify({
      id,
      message,
      title: "通知",
      buttons: Array.isArray(buttons)
        ? buttons.map((item) => ({ ...item, id: generateId() }))
        : [
            {
              id: DEFAULT_CLOSE_ID,
              text: "關閉",
              onClick: () => {
                notify.dismiss(id);
              },
              style: "cancel",
            },
          ],
    });
    return id;
  },
  /** 關閉通知 */
  dismiss(id: string) {
    store.removeNotify(id);
  },
};
