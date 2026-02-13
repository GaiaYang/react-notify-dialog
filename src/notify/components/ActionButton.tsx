import type { NotifyButtonInternal } from "../types";

import { notify } from "../core/actions";
import DialogButton from "./DialogButton";

export interface ActionButtonProps extends Omit<NotifyButtonInternal, "id"> {
  /** 要操作的通知 ID */
  notifyId: string;
}

/** 行為按鈕 */
export default function ActionButton({
  notifyId,
  style,
  onClick,
  text,
}: ActionButtonProps) {
  return (
    <DialogButton
      type="button"
      buttonStyle={style}
      onClick={(...arg) => {
        Promise.resolve(onClick?.(...arg)).then(() => {
          notify.dismiss(notifyId);
        });
      }}
    >
      {text}
    </DialogButton>
  );
}
