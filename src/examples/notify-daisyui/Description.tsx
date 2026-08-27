"use client";

import type { ComponentPropsWithoutRef } from "react";

export type DescriptionProps = ComponentPropsWithoutRef<"p">;

export default function Description(props: DescriptionProps) {
  return <p {...props} className="text-base" />;
}
