import type { NotifyInternal } from "../types";

export interface NotifyState {
  notifies: NotifyInternal[];
}

/** 客戶端狀態，動態更新 */
let clientState: NotifyState = { notifies: [] };
/** 伺服器端快取狀態，固定初始值 */
const serverState: NotifyState = { notifies: [] };
/** 監聽器列表 */
const listeners: Set<() => void> = new Set();

/** 動作類型定義 */
export type NotifyAction =
  | { type: "ADD"; payload: NotifyInternal }
  | { type: "REMOVE"; payload: { id: string } }
  | {
      type: "UPDATE";
      payload: { id: string; updates: Partial<NotifyInternal> };
    }
  | { type: "CLEAR" };

/** 統一處理狀態變化 */
function reducer(
  currentArray: NotifyInternal[],
  action: NotifyAction,
): NotifyInternal[] {
  switch (action.type) {
    case "ADD": {
      const notify = action.payload;
      if (!notify.id) {
        return currentArray;
      }
      // 避免重複 id
      if (currentArray.some((n) => n.id === notify.id)) {
        return currentArray;
      }
      return [...currentArray, notify];
    }
    case "REMOVE": {
      const { id } = action.payload;
      return currentArray.filter((n) => n.id !== id);
    }
    case "UPDATE": {
      const { id, updates } = action.payload;
      let updated = false;
      const newArray = currentArray.map((n) => {
        if (n.id === id) {
          updated = true;
          return { ...n, ...updates };
        }
        return n;
      });
      return updated ? newArray : currentArray;
    }
    case "CLEAR": {
      return currentArray.length > 0 ? [] : currentArray;
    }
    default:
      return currentArray;
  }
}

export const store = {
  getSnapshot(): NotifyState {
    return clientState;
  },
  getServerSnapshot(): NotifyState {
    return serverState;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  dispatch(action: NotifyAction) {
    const newNotifies = reducer(clientState.notifies, action);
    updateState({ notifies: newNotifies });
  },
};

function updateState(nextState: Partial<NotifyState>) {
  if (!Object.is(clientState, nextState)) {
    clientState = {
      ...clientState,
      ...nextState,
    };
    emitChange();
  }
}

/** 觸發監聽器 */
function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}
