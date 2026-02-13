"use client";

import { memo, useCallback, useState } from "react";

import type { NotifyInternal } from "../types";

import { useStore } from "../core/react";
import { CONFIRM_BUTTON } from "../core/config";

import ActionButton from "./ActionButton";
import Dialog from "./Dialog";
import DialogContent from "./DialogContent";
import DialogTitle from "./DialogTitle";
import DialogDescription from "./DialogDescription";
import DialogFooter from "./DialogFooter";

export default memo(function Notifier() {
  const { notifies } = useStore();
  const [visibleNotify, setVisibleNotify] = useState<NotifyInternal | null>(
    null,
  );
  const notify = notifies.at(-1) ?? null;
  const isOpen = Boolean(notify);

  if (notify && visibleNotify !== notify) {
    setVisibleNotify(notify);
  }

  const onTransitionEnd = useCallback<
    React.TransitionEventHandler<HTMLDialogElement>
  >((event) => {
    if (!event.currentTarget.open) {
      setVisibleNotify(null);
    }
  }, []);

  return (
    <Dialog open={isOpen} onTransitionEnd={onTransitionEnd}>
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
      <DialogFooter>{renderActions(id, buttons)}</DialogFooter>
    </>
  );
}

function renderActions(
  notifyId: string | undefined,
  buttons: NotifyInternal["buttons"],
) {
  if (!notifyId) return null;

  if (!Array.isArray(buttons) || buttons.length === 0) {
    return (
      <ActionButton
        key={CONFIRM_BUTTON.id}
        text={CONFIRM_BUTTON.text}
        style={CONFIRM_BUTTON.style}
        notifyId={notifyId}
      />
    );
  }

  return buttons.map((item) => (
    <ActionButton {...item} key={item.id} notifyId={notifyId} />
  ));
}
