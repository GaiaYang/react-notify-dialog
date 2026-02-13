"use client";

import { notify } from "@/notify";

interface TestButton {
  label: string;
  onClick: () => void;
}

interface TestOption {
  title: string;
  options: TestButton[];
}

const testOptions: TestOption[] = [
  {
    title: "基本測試",
    options: [
      {
        label: "message",
        onClick: () => {
          notify.message("message");
        },
      },
      {
        label: "alert",
        onClick: () => {
          notify.alert("title", "message", [
            {
              text: "destructive",
              onClick: () => notify.message("destructive"),
              style: "destructive",
            },
            {
              text: "cancel",
              onClick: () => notify.message("cancel"),
              style: "cancel",
            },
            {
              text: "default",
              onClick: () => notify.message("default"),
              style: "default",
            },
          ]);
        },
      },
      {
        label: "confirm",
        onClick: () => {
          notify.confirm(
            "是否同意使用者條款",
            () => notify.message("確認"),
            () => notify.message("取消"),
          );
        },
      },
      {
        label: "confirmAsync",
        onClick: async () => {
          const res = await notify.confirmAsync("是否同意使用者條款");
          if (res) {
            notify.message("確認");
          } else {
            notify.message("取消");
          }
        },
      },
    ],
  },
  {
    title: "壓力測試",
    options: [
      {
        label: "3 連 message",
        onClick() {
          for (let i = 0; i < 3; i++) {
            notify.message(`message ${i + 1}`);
          }
        },
      },
      {
        label: "3 連 alert",
        onClick() {
          for (let i = 0; i < 3; i++) {
            notify.alert("title", `message ${i + 1}`, [
              {
                text: "destructive",
                style: "destructive",
              },
              {
                text: "cancel",
                style: "cancel",
              },
              {
                text: "default",
                style: "default",
              },
            ]);
          }
        },
      },
    ],
  },
];

export default function Demo() {
  return (
    <div className="prose dark:prose-invert px-4 sm:px-6 lg:px-8">
      <h1>通知測試項目</h1>
      {testOptions.map(renderBlock)}
    </div>
  );
}

function renderBlock(item: TestOption, index: number) {
  return (
    <section key={index}>
      <h2>{item.title}</h2>
      <div className="not-prose flex flex-wrap gap-2">
        {item.options.map(renderButton)}
      </div>
    </section>
  );
}

function renderButton(item: TestButton, index: number) {
  return (
    <button key={index} type="button" onClick={item.onClick} className="btn">
      {item.label}
    </button>
  );
}
