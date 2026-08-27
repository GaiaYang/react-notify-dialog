"use client";

import type { ComponentPropsWithoutRef } from "react";

import { Dialog } from "@/dialog";

import type { NotifierButtonProps, NotifierComponents } from "./types";
import { omit } from "../utils/omit";

function Content(props: ComponentPropsWithoutRef<"div">) {
  return <div {...props} />;
}

function Title(props: ComponentPropsWithoutRef<"h2">) {
  return <h2 {...props} />;
}

function Description(props: ComponentPropsWithoutRef<"p">) {
  return <p {...props} />;
}

function Footer(props: ComponentPropsWithoutRef<"div">) {
  return <div {...props} />;
}

function Button(props: NotifierButtonProps) {
  return <button type="button" {...omit(props, ["buttonStyle"])} />;
}

/** 無樣式原生元素，作為未傳入時的 fallback */
export const defaultComponents = {
  Dialog,
  Content,
  Title,
  Description,
  Footer,
  Button,
} satisfies NotifierComponents;
