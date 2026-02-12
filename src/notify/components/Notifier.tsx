"use client";

import { memo, useEffect, useRef } from "react";

import type { NotifyInternal } from "../types";

import useNotify from "../core/useNotify";
import { DEFAULT_CLOSE_ID } from "../core/actions";
import ActionButton from "./ActionButton";

/** 用於暫存最後一個關閉前的通知，避免畫面塌陷 */
let notifyCache: NotifyInternal | null = null;

export default memo(function Notifier() {
  const { notifies } = useNotify();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstNotify = notifies[0];
  const length = notifies.length;
  const lastNotify = notifies[length - 1];
  const isOpen = length > 0;

  // 顯示/關閉 dialog
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

  useEffect(() => {
    // 暫存第一個通知，因為必定最後關閉
    if (firstNotify) {
      notifyCache = firstNotify;
    }
  }, [firstNotify]);

  /** 當前渲染資料 */
  const currentNotify = lastNotify ?? notifyCache ?? {};
  const { id = "", title = "", message = "", buttons = [] } = currentNotify;

  return (
    <dialog ref={dialogRef} id="notify_dialog" className="modal">
      <div className="modal-box">
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
        {message && <p className="my-2">{message}</p>}
        <div className="modal-action">{renderActions(id, buttons)}</div>
      </div>
    </dialog>
  );
});

function renderActions(id: string, buttons: NotifyInternal["buttons"]) {
  if (!Array.isArray(buttons) || buttons.length === 0) {
    return (
      <ActionButton key={DEFAULT_CLOSE_ID} id={id} text="關閉" style="cancel" />
    );
  }

  return buttons.map((item) => (
    <ActionButton {...item} key={item.id} id={id} />
  ));
}
