"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";

import type { NotifyInternal } from "../types";

import { useStoreSelector } from "../core/react";
import { shallow } from "../core/shallow";
import { CONFIRM_BUTTON } from "../core/config";

import ActionButton from "./ActionButton";
import Dialog from "./Dialog";
import DialogContent from "./DialogContent";
import DialogTitle from "./DialogTitle";
import DialogDescription from "./DialogDescription";
import DialogFooter from "./DialogFooter";

export default memo(function Notifier() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const notify = useStoreSelector((state) => state.notifies.at(-1) ?? null);
  const [visibleNotify, setVisibleNotify] = useState<NotifyInternal | null>(
    null,
  );
  const isOpen = Boolean(notify);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  }, [isOpen]);

  if (notify && !shallow(visibleNotify, notify)) {
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
    <Dialog ref={dialogRef} onTransitionEnd={onTransitionEnd}>
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
