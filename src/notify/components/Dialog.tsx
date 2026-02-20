import React from "react";

export type DialogProps = React.DetailedHTMLProps<
  React.DialogHTMLAttributes<HTMLDialogElement>,
  HTMLDialogElement
>;

export default function Dialog(props: DialogProps) {
  return <dialog {...props} className="modal" />;
}
