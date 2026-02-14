import { useDebugValue, useSyncExternalStore } from "react";

import { store, type NotifyState } from "./store";
import useShallow from "./useShallow";

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
  const shallowSelector = useShallow(selector);
  const state = useSyncExternalStore(
    store.subscribe,
    () => shallowSelector(store.getSnapshot()),
    () => shallowSelector(store.getServerSnapshot()),
  );

  useDebugValue(state);
  return state;
}
