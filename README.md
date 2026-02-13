# 自製通知組件

## 安裝依賴項

此功能組件只有依賴一項 UI library

[Daisy UI](https://daisyui.com/docs/install/) 如需要替換 UI 請詳見 [notify/components](./src/notify/components/README.md)

## 啟動範例專案

此專案為 Next.js ，使用 pnpm 做管理

```
pnpm install
pnpm dev
```

## 設置方式

首先在你的 `app/layout.tsx` 放入 Notifier 組件 ，它會負責渲染所有發出的通知

```tsx
import { Notifier } from "@/notify";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {children}
        <Notifier />
      </body>
    </html>
  );
}
```

現在你可以從任何地方執行 `notify()`

```tsx
"use client"; // 別忘記標記為客戶端組件

import { notify } from "@/notify";

function Component() {
  return (
    <button
      type="button"
      onClick={() => {
        notify.message("簡單通知");
      }}
    >
      通知
    </button>
  );
}
```

## 使用方法

### `message()`

簡單的通知調用，用於大部分只需要簡單通知使用者的情況

```ts
notify.message(
  message: string,
  title?: string | null,
);
```

```ts
notify.message("通知內容", "通知標題");
```

| 名稱           | 型別               | 說明                   |
| -------------- | ------------------ | ---------------------- |
| message (必填) | `string`           | 顯示在對話方塊下的訊息 |
| title          | `string` \| `null` | 對話方塊標題           |

### `alert()`

完整的通知調用，可以自訂標題、內容、按鈕

```ts
notify.alert(
  title: string | null,
  message?: string,
  buttons?: NotifyButton[],
);
```

```ts
notify.alert("通知標題", "通知內容", [
  {
    text: "下一個通知",
    onClick: () => {},
  },
]);
```

| 名稱         | 型別                            | 說明                                         |
| ------------ | ------------------------------- | -------------------------------------------- |
| title (必填) | `string` \| `null`              | 對話框標題，傳遞空字串或者 `null` 將隱藏標題 |
| message      | `string`                        | 顯示在對話方塊下的訊息                       |
| buttons      | [NotifyButton](#notifybutton)[] | 儲存按鈕配置的陣列                           |

### `confirm()`

用於確認使用者選擇的通知

```ts
notify.confirm(
  message: string,
  onConfirm?: () => void,
  onCancel?: () => void,
  title?: string | null,
);
```

```ts
notify.confirm(
  "是否同意使用者條款",
  () => {
    notify.message("同意");
  },
  () => {
    notify.message("不同意");
  },
  "條款確認",
);
```

| 名稱           | 型別               | 說明                                         |
| -------------- | ------------------ | -------------------------------------------- |
| message (必填) | `string`           | 顯示在對話方塊下的訊息                       |
| onConfirm      | `function`         | 按下確定的點擊事件，繼承 `<button />`        |
| onCancel       | `function`         | 按下否定的點擊事件，繼承 `<button />`        |
| title          | `string` \| `null` | 對話框標題，傳遞空字串或者 `null` 將隱藏標題 |

### `confirmAsync()`

用於確認使用者選擇的非同步通知

```ts
notify.confirmAsync(
  message: string,
  title?: string | null,
);
```

```ts
async () => {
  const res = await notify.confirmAsync("是否同意使用者條款", "條款確認");
  if (res) {
    notify.message("同意");
  } else {
    notify.message("不同意");
  }
};
```

| 名稱           | 型別               | 說明                                         |
| -------------- | ------------------ | -------------------------------------------- |
| message (必填) | `string`           | 顯示在對話方塊下的訊息                       |
| title          | `string` \| `null` | 對話框標題，傳遞空字串或者 `null` 將隱藏標題 |

## 型別

### NotifyButton

| 名稱    | 型別                                    | 說明                            |
| ------- | --------------------------------------- | ------------------------------- |
| text    | `string`                                | 按鈕文字                        |
| onClick | `function`                              | 按鈕點擊事件，繼承 `<button />` |
| style   | [NotifyButtonStyle](#notifybuttonstyle) | 按鈕樣式                        |

### NotifyButtonStyle

| 值            | 說明     |
| ------------- | -------- |
| 'default'     | 預設樣式 |
| 'cancel'      | 取消樣式 |
| 'destructive' | 警示樣式 |
