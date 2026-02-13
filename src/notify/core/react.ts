import {
  useDebugValue,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
  version,
} from "react";

import { store, type NotifyState } from "./store";

/** React 18+ 使用 useSyncExternalStore */
function useStoreSync(): NotifyState {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  useDebugValue(state);
  return state;
}

/** React 17 及以下使用 useState + useLayoutEffect */
function useStoreState(): NotifyState {
  const [state, setState] = useState(store.getServerSnapshot());

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe(() => setState(store.getSnapshot()));
    return unsubscribe;
  }, []);

  useDebugValue(state);
  return state;
}

/** 獲取儲存的 hook */
export const useStore =
  Number(version.split(".")[0]) >= 18 ? useStoreSync : useStoreState;
