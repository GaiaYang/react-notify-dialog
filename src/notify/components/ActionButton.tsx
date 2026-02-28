import type { NotifyButtonInternal } from "../types";

import { notify } from "../actions";
import DialogButton, { type DialogButtonProps } from "./DialogButton";

export interface ActionButtonProps
  extends NotifyButtonInternal, Pick<DialogButtonProps, "disabled"> {
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
  disabled,
}: ActionButtonProps) {
  return (
    <DialogButton
      id={id}
      type="button"
      buttonStyle={style}
      onClick={(...arg) => {
        Promise.resolve(onClick?.(...arg)).then(() => {
          notify.dismiss(notifyId);
        });
      }}
      disabled={disabled}
    >
      {text}
    </DialogButton>
  );
}
