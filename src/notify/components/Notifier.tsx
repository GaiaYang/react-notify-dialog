"use client";

import { memo, useCallback, useEffect, useEffectEvent, useState } from "react";

import type { NotifyInternal } from "../types";
import useNotify from "../core/useNotify";
import { DEFAULT_CLOSE_ID } from "../core/actions";
import ActionButton from "./ActionButton";

export default memo(function Notifier() {
  const { notifies } = useNotify();
  const [cacheNotify, setCacheNotify] = useState<NotifyInternal | null>(null);
  const length = notifies.length;
  const hasNotify = length > 0;
  const lastNotify = hasNotify ? notifies[length - 1] : null;

  const onTransitionEnd = useCallback<
    React.TransitionEventHandler<HTMLDialogElement>
  >((event) => {
    if (!event.currentTarget.open && event.propertyName === "opacity") {
      setCacheNotify((prev) => (prev ? null : prev));
    }
  }, []);

  const updateCacheNotify = useEffectEvent(setCacheNotify);

  useEffect(() => {
    if (lastNotify) {
      updateCacheNotify(lastNotify);
    }
  }, [lastNotify]);

  return (
    <dialog
      open={hasNotify}
      id="notify_dialog"
      className="modal backdrop-blur-xs"
      onTransitionEnd={onTransitionEnd}
    >
      <div className="modal-box">
        {cacheNotify ? renderContent(cacheNotify) : null}
      </div>
    </dialog>
  );
});

function renderContent({ id, title, message, buttons }: NotifyInternal) {
  return (
    <>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {message && <p className="my-2">{message}</p>}
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
