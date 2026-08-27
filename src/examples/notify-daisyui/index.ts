"use client";

import type { NotifierComponents } from "@/notify";

import Dialog from "./Dialog";
import Content from "./Content";
import Title from "./Title";
import Description from "./Description";
import Footer from "./Footer";
import Button from "./Button";

/** daisyUI 範例皮膚 — 可整包複製到專案後傳入 Notifier */
export const daisyui = {
  Dialog,
  Content,
  Title,
  Description,
  Footer,
  Button,
} satisfies NotifierComponents;
