"use client";

import { Dialog as HeadlessDialog, type DialogProps } from "@/dialog";

export type { DialogProps };

export default function Dialog(props: DialogProps) {
  return <HeadlessDialog {...props} className="modal" />;
}
