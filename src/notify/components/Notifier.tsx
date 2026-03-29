"use client";

import { memo, useCallback, useState } from "react";
import type { NotifyInternal } from "../types";

import { CONFIRM_BUTTON } from "../constants";
import { store } from "../store";
import { useStoreSelector } from "../react";

import useDialogMachine, { type DialogPhase } from "../hooks/useDialogMachine";
import useShallow from "../hooks/useShallow";

import ActionButton from "./ActionButton";
import Dialog from "./Dialog";
import DialogContent from "./DialogContent";
import DialogTitle from "./DialogTitle";
import DialogDescription from "./DialogDescription";
import DialogFooter from "./DialogFooter";

function onPhaseChange(phase: DialogPhase) {
  store.setState({ isAnimating: phase === "opening" || phase === "closing" });
}

export default memo(function Notifier() {
  const notify = useStoreSelector(
    useShallow((state) => state.notifies.at(-1) ?? null),
  );
  const notifyId = notify?.id;
  const cancelable = notify?.options?.cancelable;

  const [visibleNotify, setVisibleNotify] = useState<NotifyInternal | null>(
    null,
  );
  const visibleNotifyId = visibleNotify?.id;

  const { toggle, ref, getPhase } = useDialogMachine({
    onPhaseChange,
    onClosed() {
      setVisibleNotify(null);
    },
  });

  const onKeyDown: React.KeyboardEventHandler<HTMLDialogElement> = useCallback(
    (event) => {
      if (event.key !== "Escape") return;

      const isAnimating = store.getSnapshot().isAnimating;

      if (isAnimating || !cancelable) {
        event.preventDefault();
        return;
      }

      if (notifyId) {
        store.dispatch({ type: "REMOVE", payload: { id: notifyId } });
      }
    },
    [notifyId, cancelable],
  );

  if (!visibleNotify && notify) {
    // visibleNotify 清空後才設定新通知並開啟 dialog
    setVisibleNotify(notify);
    toggle(true);
  } else if (notifyId !== visibleNotifyId) {
    // 當通知 ID 變化且 dialog 開啟中，先關閉舊通知
    const phase = getPhase();
    if (phase === "opened" || phase === "opening") {
      toggle(false);
    }
  }

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
