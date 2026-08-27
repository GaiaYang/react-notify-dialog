import type { NotifyInternal } from "./types";

export interface NotifyState {
  /** 通知列隊（最新在尾端；UI 顯示 at(-1)） */
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
  | { type: "REMOVE"; payload: { id: string } };

/** 統一處理狀態變化；無變更時回傳原 state */
function reducer(state: NotifyState, action: NotifyAction): NotifyState {
  switch (action.type) {
    case "ADD": {
      const notify = action.payload;
      if (!notify.id || state.notifies.some((n) => n.id === notify.id)) {
        return state;
      }
      return { ...state, notifies: [...state.notifies, notify] };
    }
    case "REMOVE": {
      const { id } = action.payload;
      const notifies = state.notifies.filter((n) => n.id !== id);
      if (notifies.length === state.notifies.length) return state;
      return { ...state, notifies };
    }
    default:
      return state;
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
  /** 更新通知 */
  dispatch(action: NotifyAction) {
    updateState(reducer(state, action));
  },
  /** 更新狀態 */
  setState(
    partial: Partial<NotifyState> | ((prev: NotifyState) => NotifyState),
  ) {
    const nextState =
      typeof partial === "function" ? partial(state) : { ...state, ...partial };
    updateState(nextState);
  },
};

function updateState(nextState: NotifyState | Partial<NotifyState>) {
  if (Object.is(nextState, state)) return;

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
