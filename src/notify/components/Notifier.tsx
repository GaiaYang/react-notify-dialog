"use client";

import { memo, useCallback, useLayoutEffect, useRef, useState } from "react";
import type { NotifyInternal } from "../types";

import { CONFIRM_BUTTON } from "../constants";
import { store, type NotifyState } from "../store";
import { notify as notifyApi } from "../actions";
import { useStoreSelector } from "../react";

import useDialogMachine, { type DialogPhase } from "../hooks/useDialogMachine";

import ActionButton from "./ActionButton";
import Dialog from "./Dialog";
import DialogContent from "./DialogContent";
import DialogTitle from "./DialogTitle";
import DialogDescription from "./DialogDescription";
import DialogFooter from "./DialogFooter";

function onPhaseChange(phase: DialogPhase) {
  store.setState({ isAnimating: phase === "opening" || phase === "closing" });
}

/** 顯示最新一則（stack：後進先看） */
function selectLatestNotify(state: NotifyState) {
  return state.notifies.at(-1) ?? null;
}

export default memo(function Notifier() {
  const current = useStoreSelector(selectLatestNotify);
  const notifyId = current?.id;
  const cancelable = current?.options?.cancelable;

  // 離場期間保留內容；進場時在同一次 render 寫入，避免額外 setState
  const visibleRef = useRef<NotifyInternal | null>(null);
  const [, rerender] = useState(0);

  if (current && !visibleRef.current) {
    visibleRef.current = current;
  }

  const visibleNotify = visibleRef.current;
  const visibleNotifyId = visibleNotify?.id;

  const { toggle, ref, getPhase } = useDialogMachine({
    onPhaseChange,
    onClosed() {
      if (!visibleRef.current) return;
      visibleRef.current = null;
      rerender((n) => n + 1);
    },
  });

  // 內容 commit 後再開／關，進場時內容會跟著動畫一起出現
  useLayoutEffect(() => {
    if (!visibleNotifyId) return;

    if (notifyId === visibleNotifyId) {
      const phase = getPhase();
      if (phase === "closed" || phase === "unmounted") {
        toggle(true);
      }
      return;
    }

    const phase = getPhase();
    if (phase === "opened" || phase === "opening") {
      toggle(false);
    }
  }, [notifyId, visibleNotifyId, toggle, getPhase]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDialogElement> = useCallback(
    (event) => {
      if (event.key !== "Escape") return;

      const isAnimating = store.getSnapshot().isAnimating;

      if (isAnimating || !cancelable) {
        event.preventDefault();
        return;
      }

      if (notifyId) {
        notifyApi.dismiss(notifyId);
      }
    },
    [notifyId, cancelable],
  );

  function renderContent() {
    if (!visibleNotify) return null;

    const { id, title, message, buttons } = visibleNotify;

    return (
      <>
        {title && <DialogTitle>{title}</DialogTitle>}
        {message && <DialogDescription>{message}</DialogDescription>}
        <DialogFooter>
          {!Array.isArray(buttons) || buttons.length === 0 ? (
            <ActionButton
              {...CONFIRM_BUTTON}
              key={CONFIRM_BUTTON.id}
              notifyId={id}
            />
          ) : (
            buttons.map((item) => (
              <ActionButton {...item} key={item.id} notifyId={id} />
            ))
          )}
        </DialogFooter>
      </>
    );
  }

  return (
    <Dialog ref={ref} onKeyDown={onKeyDown}>
      <DialogContent>{renderContent()}</DialogContent>
    </Dialog>
  );
});
