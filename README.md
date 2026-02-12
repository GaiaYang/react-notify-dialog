# 自製通知組件

## 安裝依賴項

[Daisy UI](https://daisyui.com/docs/install/) 預設的樣式庫，可以需求到 `notify/components` 調整組件樣式

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

簡單的通知調用，會給予預設的標題及固定一個可關閉的按鈕，通常情況只需要傳入message

```ts
message (
  message: string,
  buttons?: NotifyButton[],
);
```

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

| 名稱    | 型別                            | 說明                   |
| ------- | ------------------------------- | ---------------------- |
| message | string                          | 顯示在對話方塊下的訊息 |
| buttons | [NotifyButton](#notifybutton)[] | 儲存按鈕配置的陣列     |

### `alert()`

完整的通知調用，可以自訂標題、內容、按鈕

```ts
alert (
  title: string|null,
  message?: string,
  buttons?: NotifyButton[],
);
```

```tsx
"use client";

import { notify } from "@/notify";

function Component() {
  return (
    <button
      type="button"
      onClick={() => {
        notify.alert("自訂通知", "通知內容", [
          {
            text: "下一個通知",
            onClick: () => {
              notify.message("通知 2");
            },
          },
        ]);
      }}
    >
      通知
    </button>
  );
}
```

| 名稱         | 型別                            | 說明                                         |
| ------------ | ------------------------------- | -------------------------------------------- |
| title (必填) | string \| `null`                | 對話框標題，傳遞空字串或者 `null` 將隱藏標題 |
| message      | string                          | 顯示在對話方塊下的訊息                       |
| buttons      | [NotifyButton](#notifybutton)[] | 儲存按鈕配置的陣列                           |

## 型別

### NotifyButton

| 名稱    | 型別                                    | 說明                     |
| ------- | --------------------------------------- | ------------------------ |
| text    | string                                  | 按鈕文字                 |
| onClick | function                                | 按鈕點擊事件，繼承button |
| style   | [NotifyButtonStyle](#notifybuttonstyle) | 按鈕樣式                 |

### NotifyButtonStyle

| 值            | 說明     |
| ------------- | -------- |
| 'default'     | 預設樣式 |
| 'cancel'      | 取消樣式 |
| 'destructive' | 警示樣式 |
