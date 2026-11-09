import { useState, type InputHTMLAttributes } from 'react'

/**
 * A number box you can type into freely. Clamping on every keystroke turns
 * "100" into 5 → 50 → 200, so in-range values apply as you type and anything
 * else is clamped only when you leave the box or press Enter.
 */
export function NumberField({
  value,
  min,
  max,
  onCommit,
  ...rest
}: {
  value: number
  min: number
  max: number
  /** Gets the raw number; the caller clamps it. */
  onCommit: (n: number) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'min' | 'max' | 'onChange' | 'type'>) {
  const [draft, setDraft] = useState<string | null>(null)

  const finish = () => {
    if (draft === null) return
    const n = Number(draft)
    if (draft.trim() !== '' && Number.isFinite(n)) onCommit(n)
    setDraft(null)
  }

  return (
    <input
      {...rest}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={draft ?? String(value)}
      onChange={(e) => {
        const raw = e.target.value
        setDraft(raw)
        const n = Number(raw)
        if (raw.trim() !== '' && Number.isFinite(n) && n >= min && n <= max) onCommit(n)
      }}
      onBlur={(e) => {
        finish()
        rest.onBlur?.(e)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
        rest.onKeyDown?.(e)
      }}
    />
  )
}
