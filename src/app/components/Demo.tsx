"use client";

import { notify } from "@/notify";

const buttons: {
  label: string;
  onClick: () => void;
}[] = [
  {
    label: "確認彈窗",
    onClick: async () => {
      notify.confirm(
        "是否同意使用者條款",
        () => notify.message("確認"),
        () => notify.message("取消"),
      );
    },
  },
  {
    label: "非同步確認彈窗",
    onClick: async () => {
      const res = await notify.confirmAsync("是否同意使用者條款");
      if (res) {
        notify.message("確認");
      } else {
        notify.message("取消");
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
