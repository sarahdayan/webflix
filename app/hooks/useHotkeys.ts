import type { HotkeysEvent } from "hotkeys-js";
import hotkeys from "hotkeys-js";
import { useCallback, useEffect } from "react";

type CallbackFn = (event: KeyboardEvent, handler: HotkeysEvent) => void;

export function useHotkeys<TDependencies>(
  keys: string,
  callback: CallbackFn,
  deps: TDependencies[] = []
) {
  const memoizedCallback = useCallback(callback, deps);

  useEffect(() => {
    hotkeys.filter = () => true;
    hotkeys(keys, memoizedCallback);

    return () => hotkeys.unbind(keys);
  }, [keys, memoizedCallback]);
}
