import { useEffect, useState, useSyncExternalStore, version } from "react";

import { store, type NotifyState } from "./store";

/** React 18+ 使用 useSyncExternalStore */
function useNotifySync(): NotifyState {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

/** React 17 及以下使用 useState + useEffect */
function useNotifyState(): NotifyState {
  const [state, setState] = useState(store.getSnapshot());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setState(store.getSnapshot()));
    return unsubscribe;
  }, []);

  return state;
}

/** 通知 hook */
const useNotify =
  Number(version.split(".")[0]) >= 18 ? useNotifySync : useNotifyState;

export default useNotify;
