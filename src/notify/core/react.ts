import {
  useCallback,
  useDebugValue,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  version,
} from "react";

import { store, type NotifyState } from "./store";

/** 是否支援 useSyncExternalStore */
const isSupportSyncExternal = Number(version.split(".")[0]) >= 18;

function useStoreSync(): NotifyState {
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  useDebugValue(state);
  return state;
}

function useStoreState(): NotifyState {
  const [state, setState] = useState(store.getSnapshot());
  const stateRef = useRef(state);

  const checkForUpdates = useEffectEvent(() => {
    const next = store.getSnapshot();
    if (!Object.is(stateRef.current, next)) {
      stateRef.current = next;
      setState(next);
    }
  });

  useLayoutEffect(() => {
    // 必須先 subscribe 再檢查，避免漏掉中間更新
    const unsubscribe = store.subscribe(checkForUpdates);
    checkForUpdates();
    return unsubscribe;
  }, []);

  useDebugValue(state);
  return state;
}

/** 獲取儲存 hook */
export const useStore = isSupportSyncExternal ? useStoreSync : useStoreState;

// selector 版本
function useStoreSelectorSync<T>(selector: (state: NotifyState) => T): T {
  const state = useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getSnapshot()), [selector]),
    useCallback(() => selector(store.getServerSnapshot()), [selector]),
  );

  useDebugValue(state);
  return state;
}

function useStoreSelectorState<T>(selector: (state: NotifyState) => T): T {
  const [selected, setSelected] = useState(() => selector(store.getSnapshot()));
  const selectedRef = useRef(selected);
  const selectorRef = useRef(selector);

  const checkForUpdates = useEffectEvent(() => {
    const next = selectorRef.current(store.getSnapshot());
    if (!Object.is(selectedRef.current, next)) {
      selectedRef.current = next;
      setSelected(next);
    }
  });

  useLayoutEffect(() => {
    // 必須先 subscribe 再檢查，避免漏掉中間更新
    const unsubscribe = store.subscribe(checkForUpdates);
    checkForUpdates();
    return unsubscribe;
  }, []);

  useDebugValue(selected);
  return selected;
}

/** 獲取 selector 版本的儲存 hook  */
export const useStoreSelector = isSupportSyncExternal
  ? useStoreSelectorSync
  : useStoreSelectorState;
