import { useCallback, useDebugValue, useSyncExternalStore } from "react";

import { store, type NotifyState } from "./store";

export function useStoreSelector<T>(selector: (state: NotifyState) => T): T {
  const slice = useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getSnapshot()), [selector]),
    useCallback(() => selector(store.getServerSnapshot()), [selector]),
  );
  useDebugValue(slice);
  return slice;
}
