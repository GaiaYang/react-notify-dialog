import type { NotifyInternal } from "../types";
import { shallow } from "./shallow";

export interface NotifyState {
  notifies: NotifyInternal[];
}

/** 客戶端狀態，動態更新 */
let state: NotifyState = { notifies: [] };
/** 伺服器端快取狀態，固定初始值 */
const initialState: Readonly<NotifyState> = { notifies: [] };
/** 監聽器列表 */
const listeners: Set<() => void> = new Set();

/** 動作類型定義 */
export type NotifyAction =
  | { type: "ADD"; payload: NotifyInternal }
  | { type: "REMOVE"; payload: { id: string } }
  | {
      type: "UPDATE";
      payload: { id: string; update: Partial<NotifyInternal> };
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
      if (!notify.id) return currentArray;
      if (currentArray.some((n) => n.id === notify.id)) return currentArray;
      return [...currentArray, notify];
    }
    case "REMOVE": {
      const { id } = action.payload;
      const newArray: NotifyInternal[] = [];
      let found = false;
      for (const item of currentArray) {
        if (item.id === id) {
          found = true;
          continue;
        }
        newArray.push(item);
      }
      return found ? newArray : currentArray;
    }
    case "UPDATE": {
      const { id, update } = action.payload;
      const newArray = currentArray.slice();
      let updated = false;
      for (let i = 0; i < newArray.length; i++) {
        const item = newArray[i];
        if (item.id === id) {
          const merged = { ...item, ...update };
          if (!shallow(item, merged)) {
            newArray[i] = merged;
            updated = true;
          }
          break;
        }
      }
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
    return state;
  },
  getServerSnapshot(): NotifyState {
    return initialState;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  dispatch(action: NotifyAction) {
    const newNotifies = reducer(state.notifies, action);
    updateState({ notifies: newNotifies });
  },
};

function updateState(nextState: Partial<NotifyState>) {
  state = {
    ...state,
    ...nextState,
  };
  emitChange();
}

/** 觸發監聽器 */
function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}
