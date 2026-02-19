"use client";

import { memo, useEffect, useState } from "react";

import type { NotifyInternal } from "../types";

import { useStoreSelector } from "../core/react";
import { CONFIRM_BUTTON } from "../core/config";

import ActionButton from "./ActionButton";
import Dialog from "./Dialog";
import DialogContent from "./DialogContent";
import DialogTitle from "./DialogTitle";
import DialogDescription from "./DialogDescription";
import DialogFooter from "./DialogFooter";
import useDialogObserver from "./useDialogObserver";

export default memo(function Notifier() {
  const { toggle, ref, getPhase } = useDialogObserver({
    onClosed() {
      setVisibleNotify(null);
    },
  });
  const notify = useStoreSelector((state) => state.notifies.at(-1) ?? null);
  const notifyId = notify?.id;
  const [visibleNotify, setVisibleNotify] = useState<NotifyInternal | null>(
    null,
  );

  // 通知 ID 變化當作判斷依據來確保通知關閉後 dialog 關閉
  useEffect(() => {
    const phase = getPhase();
    if (phase === "opened") {
      toggle(false);
    }
  }, [toggle, getPhase, notifyId]);

  // visibleNotify 被清除後才重新帶入新的通知並重新開啟 dialog
  useEffect(() => {
    if (!visibleNotify && notify) {
      setVisibleNotify(notify);
      toggle(true);
    }
  }, [toggle, visibleNotify, notify]);

  return (
    <Dialog ref={ref}>
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
