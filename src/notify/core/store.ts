import type { NotifyInternal } from "../types";

export interface NotifyState {
  notifies: NotifyInternal[];
}

/** 當前狀態 */
let state: NotifyState = { notifies: [] };

/** 監聽器列表 */
const listeners: Array<() => void> = [];

export const store = {
  getSnapshot(): NotifyState {
    return state;
  },
  getServerSnapshot(): NotifyState {
    return state;
  },
  subscribe(listener: () => void): () => void {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },
  // 以下為外部函式
  addNotify(notify: NotifyInternal) {
    state = { ...state, notifies: [...state.notifies, notify] };
    emitChange();
  },
  removeNotify(notifyId: string) {
    if (!notifyId) return;
    state = {
      ...state,
      notifies: state.notifies.filter((item) => item.id !== notifyId),
    };
    emitChange();
  },
};

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}
