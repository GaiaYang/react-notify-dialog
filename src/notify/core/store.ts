import type { NotifyInternal } from "../types";

export interface NotifyState {
  notifies: NotifyInternal[];
}

/** 通知列隊 */
let notifiesMap: Map<string, NotifyInternal> = new Map();
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
  currentMap: Map<string, NotifyInternal>,
  action: NotifyAction,
): Map<string, NotifyInternal> {
  // 只操作副本
  const newMap = new Map(currentMap);

  switch (action.type) {
    case "ADD": {
      const notify = action.payload;
      if (notify.id && !newMap.has(notify.id)) {
        newMap.set(notify.id, notify);
      }
      break;
    }
    case "REMOVE": {
      const { id } = action.payload;
      if (id) {
        newMap.delete(id);
      }
      break;
    }
    case "UPDATE": {
      const { id, updates } = action.payload;
      if (newMap.has(id)) {
        const existing = newMap.get(id)!;
        newMap.set(id, { ...existing, ...updates });
      }
      break;
    }
    case "CLEAR": {
      newMap.clear();
      break;
    }
    default:
      return currentMap;
  }

  return newMap;
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
  // 以下為外部函式
  /** 處理通知行為 */
  dispatch(action: NotifyAction) {
    const newMap = reducer(notifiesMap, action);
    // 簡單檢查是否有變化，避免無謂更新
    if (newMap !== notifiesMap) {
      notifiesMap = newMap;
      clientState = { notifies: Array.from(newMap.values()) };
      emitChange();
    }
  },
};

/** 觸發監聽器 */
function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}
