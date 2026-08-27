"use client";

import type { ComponentPropsWithoutRef } from "react";

export type TitleProps = ComponentPropsWithoutRef<"h2">;

export default function Title(props: TitleProps) {
  return <h2 {...props} className="text-lg font-semibold has-[+p]:mb-4" />;
}
