# 自製通知組件

一個輕量、無樣式依賴的 React 通知系統，適用於 Next.js 專案。支援簡單通知、完整訊息框、以及同步/非同步確認通知。

## 安裝依賴

此組件僅依賴一個 UI library：

- [DaisyUI](https://daisyui.com/docs/install/)

> 如需替換 UI，請參考 [`notify/components`](./src/notify/components/README.md)

## 啟動範例專案

專案基於 Next.js，使用 `pnpm` 管理依賴：

```bash
pnpm install
pnpm dev
```

## 使用方式

### 在 Layout 中引入 Notifier

將 `Notifier` 放在 `app/layout.tsx`，負責渲染所有通知：

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

### 發送通知

從任意 Client Component 執行 `notify()`

```tsx
"use client";

import { notify } from "@/notify";

export default function Component() {
  return (
    <button type="button" onClick={() => notify.message("簡單通知")}>
      顯示通知
    </button>
  );
}
```

## API

### `message()`

簡單通知，適合大部分情境。

```ts
notify.message(message: string, title?: string | null);
```

```ts
notify.message("通知內容", "通知標題");
```

| 名稱    | 型別             | 說明                             |
| ------- | ---------------- | -------------------------------- |
| message | `string`         | 訊息內容                         |
| title   | `string \| null` | 標題，傳空字串或 `null` 隱藏標題 |

### `alert()`

完整通知，可自訂標題、訊息、按鈕。

```ts
notify.alert(title: string | null, message?: string, buttons?: NotifyButton[]);
```

```ts
notify.alert("通知標題", "通知內容", [
  { text: "下一個通知", onClick: () => {} },
]);
```

| 名稱    | 型別                              | 說明                             |
| ------- | --------------------------------- | -------------------------------- |
| title   | `string \| null`                  | 標題，傳空字串或 `null` 隱藏標題 |
| message | `string`                          | 訊息內容                         |
| buttons | [`NotifyButton[]`](#notifybutton) | 按鈕配置陣列                     |

### `confirm()`

同步確認通知，支援確定/取消回調：

```ts
notify.confirm(
  message: string,
  onConfirm?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  onCancel?: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  title?: string | null,
);
```

```ts
notify.confirm(
  "是否同意使用者條款",
  () => notify.message("同意"),
  () => notify.message("不同意"),
  "條款確認",
);
```

| 名稱      | 型別             | 說明                             |
| --------- | ---------------- | -------------------------------- |
| message   | `string`         | 訊息內容                         |
| onConfirm | `function`       | 確定按鈕回調                     |
| onCancel  | `function`       | 取消按鈕回調                     |
| title     | `string \| null` | 標題，傳空字串或 `null` 隱藏標題 |

### `confirmAsync()`

非同步確認通知，方便 `async/await` 使用

```ts
const res = await notify.confirmAsync(message: string, title?: string | null);
```

```ts
async () => {
  const res = await notify.confirmAsync("是否同意使用者條款", "條款確認");
  if (res) notify.message("同意");
  else notify.message("不同意");
};
```

| 名稱    | 型別             | 說明                             |
| ------- | ---------------- | -------------------------------- |
| message | `string`         | 訊息內容                         |
| title   | `string \| null` | 標題，傳空字串或 `null` 隱藏標題 |

## 型別說明

### NotifyButton

| 名稱    | 型別                                                         | 說明                            |
| ------- | ------------------------------------------------------------ | ------------------------------- |
| text    | `string`                                                     | 按鈕文字                        |
| onClick | `(event: MouseEvent<HTMLButtonElement, MouseEvent>) => void` | 按鈕點擊事件，繼承 `<button />` |
| style   | [NotifyButtonStyle](#notifybuttonstyle)                      | 按鈕樣式                        |

### NotifyButtonStyle

| 值            | 說明     |
| ------------- | -------- |
| 'default'     | 預設樣式 |
| 'cancel'      | 取消樣式 |
| 'destructive' | 警示樣式 |
