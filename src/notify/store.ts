import type { NotifyInternal } from "./types";
import { shallow } from "./utils/shallow";

export interface NotifyState {
  /** 通知列隊 */
  notifies: NotifyInternal[];
  /** dialog 是否正在動畫中 */
  isAnimating: boolean;
}

/** 客戶端狀態，動態更新 */
let state: NotifyState = { notifies: [], isAnimating: false };
/** 伺服器端快取狀態，固定初始值 */
const initialState: Readonly<NotifyState> = {
  notifies: [],
  isAnimating: false,
};
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
function reducer(state: NotifyState, action: NotifyAction): NotifyState {
  const nextState = { ...state };

  switch (action.type) {
    case "ADD": {
      const notify = action.payload;
      if (!notify.id || state.notifies.some((n) => n.id === notify.id)) {
        nextState.notifies = state.notifies;
        break;
      }
      nextState.notifies = [...state.notifies, notify];
      break;
    }
    case "REMOVE": {
      const { id } = action.payload;
      const newArray: NotifyInternal[] = [];
      let found = false;
      for (const item of state.notifies) {
        if (item.id === id) {
          found = true;
          continue;
        }
        newArray.push(item);
      }
      nextState.notifies = found ? newArray : state.notifies;
      break;
    }
    case "UPDATE": {
      const { id, update } = action.payload;
      const newArray = state.notifies.slice();
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
      nextState.notifies = updated ? newArray : state.notifies;
      break;
    }
    case "CLEAR": {
      nextState.notifies = state.notifies.length > 0 ? [] : state.notifies;
      break;
    }
    default:
      break;
  }

  return nextState;
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
  // 外部用函式
  /** 更新通知 */
  dispatch(action: NotifyAction) {
    updateState(reducer(state, action));
  },
  /** 更新狀態 */
  setState(
    partial:
      | Partial<NotifyState>
      | ((prev: Partial<NotifyState>) => NotifyState),
  ) {
    const nextState =
      typeof partial === "function"
        ? (partial as (state: NotifyState) => NotifyState)(state)
        : partial;
    updateState(nextState);
  },
};

function updateState(nextState: Partial<NotifyState>) {
  if (!Object.is(nextState, state)) {
    state = {
      ...state,
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
