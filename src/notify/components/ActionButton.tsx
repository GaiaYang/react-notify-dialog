import type { NotifyButtonInternal } from "../types";

import { notify } from "../core/actions";

export default function ActionButton({
  id,
  style,
  onClick,
  text,
}: NotifyButtonInternal) {
  const commonProps: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > = {
    type: "button",
    onClick(...arg) {
      Promise.resolve(onClick?.(...arg)).then(() => {
        notify.dismiss(id);
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
}
