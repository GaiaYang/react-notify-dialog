"use client";

import { notify } from "@/notify";

const buttons: {
  label: string;
  onClick: () => void;
}[] = [
  {
    label: "單一通知",
    onClick: () => {
      notify.message("單一通知");
    },
  },
  {
    label: "二連通知",
    onClick: () => {
      notify.message("通知 1");
      notify.message("通知 2");
    },
  },
  {
    label: "巢狀通知",
    onClick: () => {
      notify.message("通知 1", [
        {
          text: "下一個通知",
          onClick: () => {
            notify.message("通知 2");
          },
        },
      ]);
    },
  },
  {
    label: "自定義通知",
    onClick: () => {
      notify.alert("通知標題", "通知內容", [
        {
          text: "下一個通知",
          onClick: () => {
            notify.message("通知 2");
          },
        },
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "刪除",
          onClick: () => {
            notify.message("成功");
          },
          style: "destructive",
        },
      ]);
    },
  },
  {
    label: "多層 alert",
    onClick: () => {
      notify.alert("第一層", "第一個 alert", [
        {
          text: "下一個 alert",
          onClick: () => {
            notify.alert("第二層", "第二個 alert", [
              { text: "關閉", style: "cancel" },
            ]);
          },
        },
      ]);
    },
  },
  {
    label: "快速連發通知",
    onClick: () => {
      for (let i = 1; i <= 5; i++) {
        notify.message(`快速通知 ${i}`);
      }
    },
  },
  {
    label: "Message + Alert 混合",
    onClick: () => {
      notify.message("先跳簡單訊息");
      notify.alert("Alert 標題", "Alert 內容", [
        { text: "關閉", style: "cancel" },
      ]);
    },
  },
  {
    label: "Message + Alert 多重混合",
    onClick: () => {
      for (let i = 1; i <= 5; i++) {
        notify.message(`快速通知 ${i}`);
      }
      notify.alert("Alert 標題", "Alert 內容", [
        {
          text: "更多通知",
          onClick() {
            for (let i = 1; i <= 5; i++) {
              notify.message(`更多通知 ${i}`);
            }
          },
        },
        { text: "關閉", style: "cancel" },
      ]);
      for (let i = 1; i <= 5; i++) {
        notify.message(`後續快速通知 ${i}`);
      }
    },
  },
];

export default function Demo() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-wrap justify-center gap-2 p-2">
      {buttons.map((item, index) => {
        return (
          <button
            key={index}
            type="button"
            onClick={item.onClick}
            className="btn"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
