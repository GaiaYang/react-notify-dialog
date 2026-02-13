import type { Notify } from "../types";

import { store } from "./store";
import generateId from "./generateId";
import {
  DEFAULT_TITLE,
  DEFAULT_CLOSE_ID,
  DEFAULT_CLOSE_TEXT,
  DEFAULT_CLOSE_STYLE,
} from "./config";

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
        buttons: buttons?.map((item) => ({ ...item, id: generateId() })),
      },
    });
    return id;
  },
  /** 顯示簡單訊息通知，沒有標題 */
  message(message: Notify["message"], buttons?: Notify["buttons"]): string {
    const id = generateId();
    store.dispatch({
      type: "ADD",
      payload: {
        id,
        message,
        title: DEFAULT_TITLE,
        buttons: Array.isArray(buttons)
          ? buttons.map((item) => ({ ...item, id: generateId() }))
          : [
              {
                id: DEFAULT_CLOSE_ID,
                text: DEFAULT_CLOSE_TEXT,
                style: DEFAULT_CLOSE_STYLE,
              },
            ],
      },
    });
    return id;
  },
  /** 關閉通知 */
  dismiss(id: string) {
    store.dispatch({ type: "REMOVE", payload: { id } });
  },
};
