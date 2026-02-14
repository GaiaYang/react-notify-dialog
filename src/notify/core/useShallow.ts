import { useRef } from "react";

import { shallow } from "./shallow";

/**
 * 淺比較 hoook
 *
 * [原始碼](https://github.com/pmndrs/zustand/blob/main/src/react/shallow.ts)
 */
export default function useShallow<S, U>(
  selector: (state: S) => U,
): (state: S) => U {
  const prev = useRef<U>(undefined);
  return (state) => {
    const next = selector(state);
    return shallow(prev.current, next)
      ? (prev.current as U)
      : (prev.current = next);
  };
}
