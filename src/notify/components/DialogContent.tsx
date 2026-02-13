import React from "react";

export type DialogContentProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function DialogContent(props: DialogContentProps) {
  return <div {...props} className="modal-box flex flex-col gap-2" />;
}
