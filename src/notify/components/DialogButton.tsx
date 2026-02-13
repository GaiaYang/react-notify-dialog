import React from "react";

import type { NotifyButtonStyle } from "../types";

export interface DialogButtonProps extends React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  buttonStyle?: NotifyButtonStyle;
}

/** Dialog 按鈕 */
export default function DialogButton({
  buttonStyle,
  ...props
}: DialogButtonProps) {
  switch (buttonStyle) {
    case "cancel":
      return <button {...props} className="btn" />;
    case "destructive":
      return <button {...props} className="btn btn-error" />;
    default:
    case "default":
      return <button {...props} className="btn btn-primary" />;
  }
}
