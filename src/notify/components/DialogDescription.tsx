import React from "react";

export type DialogDescriptionProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

export default function DialogDescription(props: DialogDescriptionProps) {
  return <p {...props} className="grow text-base" />;
}
