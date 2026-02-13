import React from "react";

export type DialogFooterProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export default function DialogFooter(props: DialogFooterProps) {
  return <div {...props} className="modal-action" />;
}
