import { useEffect, useId, useRef, useState } from 'react'

export type MultiOption = { value: string; label: string }

/** Themed multi-select dropdown with chip summary. */
export function MultiSelect({
  label,
  options,
  values,
  onChange,
  allLabel = 'All',
}: {
  label: string
  options: MultiOption[]
  values: string[]
  onChange: (next: string[]) => void
  allLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const summary =
    values.length === 0
      ? allLabel
      : values.length === 1
        ? (options.find((o) => o.value === values[0])?.label ?? values[0])
        : `${values.length} selected`

  function toggle(value: string) {
    if (values.includes(value)) onChange(values.filter((v) => v !== value))
    else onChange([...values, value])
  }

  return (
    <div className={`multi-select ${open ? 'open' : ''}`} ref={rootRef}>
      <span className="vocab-filter-label">{label}</span>
      <button
        type="button"
        className="multi-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{summary}</span>
        <span className="multi-select-caret" aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <ul
          id={listId}
          className="multi-select-menu"
          role="listbox"
          aria-multiselectable
        >
          <li>
            <button
              type="button"
              className="multi-select-option"
              onClick={() => onChange([])}
            >
              <span className={`multi-check ${values.length === 0 ? 'on' : ''}`} />
              {allLabel}
            </button>
          </li>
          {options.map((opt) => {
            const on = values.includes(opt.value)
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  className="multi-select-option"
                  role="option"
                  aria-selected={on}
                  onClick={() => toggle(opt.value)}
                >
                  <span className={`multi-check ${on ? 'on' : ''}`} />
                  {opt.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/** Multi-term search: Enter adds a token chip; commas also split. */
export function MultiSearch({
  tokens,
  onChange,
  placeholder,
  'aria-label': ariaLabel,
}: {
  tokens: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  'aria-label'?: string
}) {
  const [draft, setDraft] = useState('')

  function commit(raw: string) {
    const parts = raw
      .split(/[,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    if (parts.length === 0) return
    const next = [...tokens]
    for (const p of parts) {
      const lower = p.toLowerCase()
      if (!next.some((t) => t.toLowerCase() === lower)) next.push(p)
    }
    onChange(next)
    setDraft('')
  }

  return (
    <div className="multi-search">
      <div className="multi-search-chips">
        {tokens.map((t) => (
          <button
            key={t}
            type="button"
            className="search-chip"
            onClick={() => onChange(tokens.filter((x) => x !== t))}
            title="Remove"
          >
            {t}
            <span aria-hidden>×</span>
          </button>
        ))}
        <input
          type="search"
          className="multi-search-input"
          placeholder={tokens.length === 0 ? placeholder : 'Add term…'}
          value={draft}
          aria-label={ariaLabel}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commit(draft)
            } else if (e.key === 'Backspace' && !draft && tokens.length > 0) {
              onChange(tokens.slice(0, -1))
            }
          }}
          onBlur={() => {
            if (draft.trim()) commit(draft)
          }}
        />
      </div>
      <p className="multi-search-hint">
        Enter or comma for multiple terms (all must match)
      </p>
    </div>
  )
}

export function matchesSearchTokens(
  haystack: string,
  tokens: string[],
): boolean {
  if (tokens.length === 0) return true
  const hay = haystack.toLowerCase()
  return tokens.every((t) => hay.includes(t.toLowerCase()))
}
