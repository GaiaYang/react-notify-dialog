"use client";

import { memo, useEffect, useRef } from "react";

import type { NotifyInternal } from "../types";
import useNotify from "../core/useNotify";
import { DEFAULT_CLOSE_ID } from "../core/actions";
import ActionButton from "./ActionButton";

export default memo(function Notifier() {
  const { notifies } = useNotify();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const length = notifies.length;
  const hasNotify = length > 0;
  const lastNotify = hasNotify ? notifies[length - 1] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (hasNotify) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [hasNotify]);

  const { id, title, message, buttons } = lastNotify || {};

  return (
    <dialog
      ref={dialogRef}
      id="notify_dialog"
      className="modal backdrop-blur-xs"
    >
      <div className="modal-box">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {message && <p className="my-2">{message}</p>}
        <div className="modal-action">{renderActions(id, buttons)}</div>
      </div>
    </dialog>
  );
});

function renderActions(
  id: string | undefined,
  buttons: NotifyInternal["buttons"],
) {
  if (!id) {
    return null;
  }
  if (!Array.isArray(buttons) || buttons.length === 0) {
    return (
      <ActionButton key={DEFAULT_CLOSE_ID} id={id} text="關閉" style="cancel" />
    );
  }

  return buttons.map((item) => (
    <ActionButton {...item} key={item.id} id={id} />
  ));
}
