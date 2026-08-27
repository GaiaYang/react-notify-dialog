import { useCallback } from "react";

import type { NotifyButtonInternal } from "../types";
import type { NotifierComponents } from "./types";
import { notify } from "../actions";
import { useStoreSelector } from "../react";

export interface ActionButtonProps extends NotifyButtonInternal {
  /** 要操作的通知 ID */
  notifyId: string;
  /** 按鈕外觀組件 */
  Button: NotifierComponents["Button"];
}

/** 行為按鈕 */
export default function ActionButton({
  notifyId,
  id,
  style,
  onClick,
  text,
  Button,
}: ActionButtonProps) {
  const isAnimating = useStoreSelector(
    useCallback((state) => state.isAnimating, []),
  );

  return (
    <Button
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
    </Button>
  );
}
