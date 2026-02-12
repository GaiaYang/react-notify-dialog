const regex = /[xy]/g;

export default function generateId() {
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
