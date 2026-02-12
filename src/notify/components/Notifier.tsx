"use client";

import { memo, useEffect, useEffectEvent, useRef, useState } from "react";

import type { NotifyInternal } from "../types";

import useNotify from "../core/useNotify";
import { DEFAULT_CLOSE_ID } from "../core/actions";
import ActionButton from "./ActionButton";

/** 用於暫存最後一個關閉前的通知，避免畫面塌陷 */
let notifyCache: NotifyInternal | null = null;

export default memo(function Notifier() {
  const { notifies } = useNotify();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);
  const firstNotify = notifies[0];
  const length = notifies.length;
  const lastNotify = notifies[length - 1];
  const isOpen = length > 0;

  const triggerVisible = useEffectEvent(setVisible);

  // 顯示/關閉 dialog
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        triggerVisible(true);
        dialog.showModal();
      } else {
        dialog.close();
        // 延遲到動畫結束才關閉顯示
        timeoutId = setTimeout(() => {
          triggerVisible(false);
        }, 300);
      }
    }

    return () => {
      clearTimeout(timeoutId);
    };
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
    <dialog
      ref={dialogRef}
      id="notify_dialog"
      className="modal backdrop-blur-xs"
    >
      {visible ? (
        <div className="modal-box">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {message && <p className="my-2">{message}</p>}
          <div className="modal-action">{renderActions(id, buttons)}</div>
        </div>
      ) : null}
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
