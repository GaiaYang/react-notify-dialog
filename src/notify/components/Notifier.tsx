"use client";

import { memo, useCallback, useEffect, useState } from "react";

import type { NotifyInternal } from "../types";

import { store } from "../core/store";
import { useStoreSelector } from "../core/react";
import { CONFIRM_BUTTON } from "../core/config";

import useDialogMachine, { type DialogPhase } from "../hooks/useDialogMachine";
import useShallow from "../hooks/useShallow";

import ActionButton from "./ActionButton";
import Dialog from "./Dialog";
import DialogContent from "./DialogContent";
import DialogTitle from "./DialogTitle";
import DialogDescription from "./DialogDescription";
import DialogFooter from "./DialogFooter";

function onPhaseChange(phase: DialogPhase) {
  store.setState({
    isAnimating: phase === "opening" || phase === "closing",
  });
}

export default memo(function Notifier() {
  const { toggle, ref, getPhase } = useDialogMachine({
    onPhaseChange,
    onClosed() {
      setVisibleNotify(null);
    },
  });
  const notify = useStoreSelector(
    useShallow((state) => state.notifies.at(-1) ?? null),
  );
  const notifyId = notify?.id;
  const cancelable = notify?.options?.cancelable;
  const [visibleNotify, setVisibleNotify] = useState<NotifyInternal | null>(
    null,
  );
  const visibleNotifyId = visibleNotify?.id;

  const onKeyDown = useCallback<React.KeyboardEventHandler<HTMLDialogElement>>(
    (event) => {
      if (event.key === "Escape") {
        if (!cancelable) {
          event.preventDefault();
        } else if (notifyId) {
          store.dispatch({ type: "REMOVE", payload: { id: notifyId } });
        }
      }
    },
    [notifyId, cancelable],
  );

  // 通知 ID 變化當作判斷依據來確保通知關閉後 dialog 關閉
  useEffect(() => {
    const phase = getPhase();
    if (
      notifyId !== visibleNotifyId &&
      (phase === "opened" || phase === "opening")
    ) {
      toggle(false);
    }
  }, [toggle, getPhase, notifyId, visibleNotifyId]);

  // visibleNotify 被清除後才重新帶入新的通知並重新開啟 dialog
  useEffect(() => {
    if (!visibleNotifyId && notify) {
      setVisibleNotify(notify);
      toggle(true);
    }
  }, [toggle, getPhase, notify, visibleNotifyId]);

  return (
    <Dialog ref={ref} onKeyDown={onKeyDown}>
      <DialogContent>
        {visibleNotify ? renderContent(visibleNotify) : null}
      </DialogContent>
    </Dialog>
  );
});

function renderContent({ id, title, message, buttons }: NotifyInternal) {
  return (
    <>
      {title && <DialogTitle>{title}</DialogTitle>}
      {message && <DialogDescription>{message}</DialogDescription>}
      <DialogFooter>
        {id ? <Actions id={id} buttons={buttons} /> : null}
      </DialogFooter>
    </>
  );
}

const Actions = memo(function Actions({
  id,
  buttons,
}: Pick<NotifyInternal, "id" | "buttons">) {
  const isAnimating = useStoreSelector(
    useCallback((state) => state.isAnimating, []),
  );

  if (!Array.isArray(buttons) || buttons.length === 0) {
    return (
      <ActionButton
        key={CONFIRM_BUTTON.id}
        id={CONFIRM_BUTTON.id}
        text={CONFIRM_BUTTON.text}
        style={CONFIRM_BUTTON.style}
        notifyId={id}
        disabled={isAnimating}
      />
    );
  }

  return buttons.map((item) => (
    <ActionButton
      {...item}
      key={item.id}
      notifyId={id}
      disabled={isAnimating}
    />
  ));
});
