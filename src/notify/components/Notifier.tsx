"use client";

import { memo, useCallback, useState } from "react";

import type { NotifyInternal } from "../types";

import { useStore } from "../core/react";
import { DEFAULT_CLOSE_ID } from "../core/config";

import ActionButton from "./ActionButton";

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
    <dialog
      open={isOpen}
      onTransitionEnd={onTransitionEnd}
      id="notify_dialog"
      className="modal backdrop-blur-xs transition-[visibility_0.3s_allow-discrete,background-color_0.3s_ease-out,backdrop-filter_0.3s_ease-out,opacity_0.1s_ease-out]"
    >
      <div className="modal-box flex flex-col gap-2">
        {visibleNotify ? <NotifyContent {...visibleNotify} /> : null}
      </div>
    </dialog>
  );
});

function NotifyContent({ id, title, message, buttons }: NotifyInternal) {
  return (
    <>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {message && <p className="grow text-base">{message}</p>}
      <div className="modal-action">{renderActions(id, buttons)}</div>
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
        key={DEFAULT_CLOSE_ID}
        id={notifyId}
        text="關閉"
        style="cancel"
      />
    );
  }

  return buttons.map((item) => (
    <ActionButton {...item} key={item.id} id={notifyId} />
  ));
}
