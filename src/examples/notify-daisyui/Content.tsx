"use client";

import type { ComponentPropsWithoutRef } from "react";

export type ContentProps = ComponentPropsWithoutRef<"div">;

export default function Content(props: ContentProps) {
  return <div {...props} className="modal-box" />;
}
