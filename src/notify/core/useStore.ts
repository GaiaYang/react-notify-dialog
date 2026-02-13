import { useEffect, useState, useSyncExternalStore, version } from "react";

import { store, type NotifyState } from "./store";

/** React 18+ 使用 useSyncExternalStore */
function useStoreSync(): NotifyState {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

/** React 17 及以下使用 useState + useEffect */
function useStoreState(): NotifyState {
  const [state, setState] = useState(store.getSnapshot());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setState(store.getSnapshot()));
    return unsubscribe;
  }, []);

  return state;
}

/** 獲取儲存的 hook */
const useStore =
  Number(version.split(".")[0]) >= 18 ? useStoreSync : useStoreState;

export default useStore;
