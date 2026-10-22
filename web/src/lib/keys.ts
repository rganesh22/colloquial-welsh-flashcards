import { useEffect } from 'react'

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  )
}

/** Global key handler that ignores typing fields. */
export function useKeydown(
  handler: (e: KeyboardEvent) => void,
  deps: unknown[] = [],
): void {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return
      handler(e)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export function digitIndex(key: string): number | null {
  if (key >= '1' && key <= '9') return Number(key) - 1
  if (key === '0') return 9
  return null
}
