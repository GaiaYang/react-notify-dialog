import { useCallback } from "react";

import type { NotifyButtonInternal } from "../types";
import { notify } from "../actions";
import { useStoreSelector } from "../react";

import DialogButton from "./DialogButton";

export interface ActionButtonProps extends NotifyButtonInternal {
  /** 要操作的通知 ID */
  notifyId: string;
}

/** 行為按鈕 */
export default function ActionButton({
  notifyId,
  id,
  style,
  onClick,
  text,
}: ActionButtonProps) {
  const isAnimating = useStoreSelector(
    useCallback((state) => state.isAnimating, []),
  );

  return (
    <DialogButton
      id={id}
      type="button"
      buttonStyle={style}
      onClick={(...arg) => {
        Promise.resolve()
          .then(() => onClick?.(...arg))
          .finally(() => {
            notify.dismiss(notifyId);
          });
      }}
      disabled={isAnimating}
    >
      {text}
    </DialogButton>
  );
}
