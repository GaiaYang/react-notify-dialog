"use client";

import type { ComponentPropsWithoutRef } from "react";

import type { NotifyButtonStyle } from "@/notify";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  buttonStyle?: NotifyButtonStyle;
};

export default function Button({ buttonStyle, ...props }: ButtonProps) {
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
