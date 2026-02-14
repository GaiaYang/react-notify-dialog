import {
  useCallback,
  useDebugValue,
  useRef,
  useSyncExternalStore,
} from "react";

import { store, type NotifyState } from "./store";
import { shallow } from "./shallow";

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
    useCallback(() => shallowSelector(store.getSnapshot()), [shallowSelector]),
    useCallback(
      () => shallowSelector(store.getServerSnapshot()),
      [shallowSelector],
    ),
  );

  useDebugValue(state);
  return state;
}

/**
 * 淺比較 hoook
 *
 * [原始碼](https://github.com/pmndrs/zustand/blob/main/src/react/shallow.ts)
 */
function useShallow<S, U>(selector: (state: S) => U): (state: S) => U {
  const prev = useRef<U>(undefined);
  return (state) => {
    const next = selector(state);
    return shallow(prev.current, next)
      ? (prev.current as U)
      : (prev.current = next);
  };
}
