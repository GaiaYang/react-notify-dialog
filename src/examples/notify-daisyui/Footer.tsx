"use client";

import type { ComponentPropsWithoutRef } from "react";

export type FooterProps = ComponentPropsWithoutRef<"div">;

export default function Footer(props: FooterProps) {
  return <div {...props} className="modal-action" />;
}
