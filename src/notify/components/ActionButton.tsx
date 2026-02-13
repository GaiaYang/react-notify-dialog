import { memo } from "react";

import type { NotifyButtonInternal } from "../types";

import { notify } from "../core/actions";

export interface ActionButtonProps extends Omit<NotifyButtonInternal, "id"> {
  /** 要操作的通知 ID */
  notifyId: string;
}

export default memo(function ActionButton({
  notifyId,
  style,
  onClick,
  text,
}: ActionButtonProps) {
  const commonProps: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > = {
    type: "button",
    onClick(...arg) {
      Promise.resolve(onClick?.(...arg)).then(() => {
        notify.dismiss(notifyId);
      });
    },
    children: text,
  };

  switch (style) {
    case "cancel":
      return <button {...commonProps} className="btn" />;
    case "destructive":
      return <button {...commonProps} className="btn btn-error" />;
    default:
    case "default":
      return <button {...commonProps} className="btn btn-primary" />;
  }
});
