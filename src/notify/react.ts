import { useCallback, useDebugValue, useSyncExternalStore } from "react";

import { store, type NotifyState } from "./store";

export function useStore(): NotifyState {
  const slice = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  useDebugValue(slice);
  return slice;
}

export function useStoreSelector<T>(selector: (state: NotifyState) => T): T {
  const slice = useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getSnapshot()), [selector]),
    useCallback(() => selector(store.getServerSnapshot()), [selector]),
  );
  useDebugValue(slice);
  return slice;
}
