import React from "react";

export type DialogProps = React.DetailedHTMLProps<
  React.DialogHTMLAttributes<HTMLDialogElement>,
  HTMLDialogElement
>;

export default function Dialog(props: DialogProps) {
  return (
    <dialog
      {...props}
      className="modal backdrop-blur-xs transition-[visibility_0.3s_allow-discrete,background-color_0.3s_ease-out,backdrop-filter_0.3s_ease-out,opacity_0.1s_ease-out]"
    />
  );
}
