const regex = /[xy]/g;

/**
 * 生成亂數 id
 *
 * 來源自 [react-hook-form](https://github.com/react-hook-form/react-hook-form/blob/master/src/logic/generateId.ts)
 */
export default function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  const d =
    typeof performance === "undefined" ? Date.now() : performance.now() * 1000;

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(regex, (c) => {
    const r = ((Math.random() * 16 + d) % 16) | 0;

    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
