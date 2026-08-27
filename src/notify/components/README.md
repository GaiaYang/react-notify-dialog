# 組件自定義說明

## 替換通知 UI

`<Notifier />` 預設使用無樣式原生元素；可傳 `components` 覆寫：

```tsx
import { Notifier } from "@/notify";
import { daisyui } from "@/examples/notify-daisyui"; // 範例皮膚，可複製

<Notifier />
<Notifier components={daisyui} />

// 局部覆寫
<Notifier
  components={{
    Title: (props) => <h2 {...props} className="my-title" />,
  }}
/>
```

daisyUI 範例在 [`src/examples/notify-daisyui`](../../examples/notify-daisyui/)，不屬於核心。

| 欄位          | 說明     | 預設元素 |
| ------------- | -------- | -------- |
| `Dialog`      | 容器     | `dialog` |
| `Content`     | 內容     | `div`    |
| `Title`       | 標題     | `h2`     |
| `Description` | 訊息     | `p`      |
| `Footer`      | 按鈕列   | `div`    |
| `Button`      | 按鈕     | `button` |

headless 狀態機與無樣式 `<dialog>` 在 `@/dialog`。
