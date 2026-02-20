import React from "react";

export type DialogTitleProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export default function DialogTitle(props: DialogTitleProps) {
  return <h2 {...props} className="text-lg font-semibold has-[+p]:mb-4" />;
}
