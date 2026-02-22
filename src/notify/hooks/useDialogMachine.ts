import { useCallback, useEffect, useMemo, useRef } from "react";

/**
 * dialog 的階段
 *
 * - "unmounted": 找不到元素
 * - "opening": 開啟中
 * - "opened": 開啟
 * - "closing": 關閉中
 * - "closed": 關閉
 */
export type DialogPhase =
  | "unmounted"
  | "opening"
  | "opened"
  | "closing"
  | "closed";

/** 監聽器的控制選項 */
export interface UseDialogMachineOptions {
  /** 階段變化時的回調 */
  onPhaseChange?: (phase: DialogPhase) => void;
  /** 開啟時的回調 */
  onOpening?: () => void;
  /** 關閉時的回調 */
  onClosing?: () => void;
  /** 開啟完成時的回調 */
  onOpened?: () => void;
  /** 關閉完成時的回調 */
  onClosed?: () => void;
  /** 掛載時的回調 */
  onMounted?: () => void;
  /** 卸載時的回調 */
  onUnmounted?: () => void;
}

/**
 * 用於控制 `<dialog />` 的狀態機
 *
 * ```ts
  function Component() {
    const { toggle, ref } = useDialogMachine()

    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box"></div>
      </dialog>
    ) 
  }
 * ```
 */
export default function useDialogMachine(
  callbacks: UseDialogMachineOptions = {},
) {
  const callbacksRef = useRef(callbacks);
  const phaseRef = useRef<DialogPhase>("unmounted");
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // 快取 callbacks 用於靜態使用
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  /** 更新 dialog 階段 */
  const setPhase = useCallback((next: DialogPhase) => {
    if (phaseRef.current === next) return;

    phaseRef.current = next;
    const { onPhaseChange, onOpening, onClosing, onOpened, onClosed } =
      callbacksRef.current;

    onPhaseChange?.(next);

    switch (next) {
      case "opening":
        onOpening?.();
        break;
      case "closing":
        onClosing?.();
        break;
      case "opened":
        onOpened?.();
        break;
      case "closed":
        onClosed?.();
        break;
    }
  }, []);

  /** 監控 open 屬性變化 */
  const handleMutation = useCallback(
    (mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "open"
        ) {
          const dialog = mutation.target as HTMLDialogElement;
          setPhase(dialog.open ? "opening" : "closing");
        }
      }
    },
    [setPhase],
  );

  /** 監控 transitionend */
  const handleTransitionFinish = useCallback(
    (event: TransitionEvent) => {
      if (event.target !== event.currentTarget) return;
      switch (phaseRef.current) {
        case "opening":
          setPhase("opened");
          break;
        case "closing":
          setPhase("closed");
          break;
        default:
          break;
      }
    },
    [setPhase],
  );

  /** 綁定 dialog 元素 */
  const ref = useCallback(
    (el: HTMLDialogElement | null) => {
      function cleanup() {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }

        if (dialogRef.current) {
          dialogRef.current.removeEventListener(
            "transitionend",
            handleTransitionFinish,
          );
          dialogRef.current.removeEventListener(
            "transitioncancel",
            handleTransitionFinish,
          );
          dialogRef.current = null;
        }

        if (phaseRef.current !== "unmounted") {
          setPhase("unmounted");
          callbacksRef.current.onUnmounted?.();
        }
      }

      if (el) {
        dialogRef.current = el;

        setPhase(el.open ? "opened" : "closed");
        callbacksRef.current.onMounted?.();

        observerRef.current = new MutationObserver(handleMutation);
        observerRef.current.observe(el, {
          attributes: true,
          attributeFilter: ["open"],
        });

        el.addEventListener("transitionend", handleTransitionFinish);
        el.addEventListener("transitioncancel", handleTransitionFinish);
      } else {
        cleanup();
      }

      return cleanup;
    },
    [handleMutation, handleTransitionFinish, setPhase],
  );

  /** 切換 dialog 開關 */
  const toggle = useCallback((next?: boolean) => {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.isConnected) return;

    const shouldOpen = typeof next === "boolean" ? next : !dialog.open;

    if (shouldOpen === dialog.open) return;

    if (shouldOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, []);

  /** 取得 dialog 當前階段 */
  const getPhase = useCallback(() => phaseRef.current, []);

  return useMemo(
    () => ({
      /** 切換 dialog 開關 */
      toggle,
      /** 綁定 dialog 元素 */
      ref,
      /** 取得 dialog 當前階段 */
      getPhase,
    }),
    [toggle, ref, getPhase],
  );
}
