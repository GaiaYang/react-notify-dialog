import { useCallback, useDebugValue, useSyncExternalStore } from "react";

import { store, type NotifyState } from "./store";

export function useStore(): NotifyState {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  useDebugValue(state);
  return state;
}

export function useStoreSelector<T>(selector: (state: NotifyState) => T): T {
  const state = useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getSnapshot()), [selector]),
    useCallback(() => selector(store.getServerSnapshot()), [selector]),
  );

  useDebugValue(state);
  return state;
}
