import { useState, type ReactNode } from 'react'
import { MultiSearch, MultiSelect, type MultiOption } from './MultiSelect'

export type VocabSortMode = 'number' | 'random' | 'easy-hard' | 'hard-easy'

const SORT_OPTIONS: { id: VocabSortMode; label: string; title: string }[] = [
  { id: 'number', label: '#', title: 'Numerical order' },
  { id: 'random', label: 'Shuffle', title: 'Random order' },
  { id: 'easy-hard', label: 'Easy→Hard', title: 'Easiest first' },
  { id: 'hard-easy', label: 'Hard→Easy', title: 'Hardest first' },
]

export function VocabBrowseControls({
  searchTokens,
  onSearchTokens,
  posOptions,
  posValues,
  onPos,
  statusValues,
  onStatus,
  strengthValues,
  onStrength,
  sortMode,
  onSortMode,
  onReshuffle,
  resultCount,
  totalCount,
  defaultOpen = true,
}: {
  searchTokens: string[]
  onSearchTokens: (v: string[]) => void
  posOptions: MultiOption[]
  posValues: string[]
  onPos: (v: string[]) => void
  statusValues: string[]
  onStatus: (v: string[]) => void
  strengthValues: string[]
  onStrength: (v: string[]) => void
  sortMode: VocabSortMode
  onSortMode: (v: VocabSortMode) => void
  onReshuffle?: () => void
  resultCount: number
  totalCount: number
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const active =
    searchTokens.length > 0 ||
    posValues.length > 0 ||
    statusValues.length > 0 ||
    strengthValues.length > 0

  return (
    <div className="vocab-browse">
      <details
        className="vocab-filter-fold"
        open={open}
        onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary>
          Search & filters
          {active && <span className="fold-badge">active</span>}
        </summary>
        <div className="vocab-toolbar folded">
          <MultiSearch
            tokens={searchTokens}
            onChange={onSearchTokens}
            placeholder="Search Welsh, English, notes…"
            aria-label="Search vocabulary"
          />
          <div className="vocab-filters">
            <MultiSelect
              label="POS"
              options={posOptions}
              values={posValues}
              onChange={onPos}
            />
            <MultiSelect
              label="Status"
              values={statusValues}
              onChange={onStatus}
              options={[
                { value: 'due', label: 'Due' },
                { value: 'learning', label: 'Learning' },
                { value: 'new', label: 'New' },
                { value: 'review', label: 'Review' },
              ]}
            />
            <MultiSelect
              label="Strength"
              values={strengthValues}
              onChange={onStrength}
              options={[
                { value: 'New', label: 'New' },
                { value: 'Learning', label: 'Learning' },
                { value: 'Young', label: 'Young' },
                { value: 'Good', label: 'Good' },
                { value: 'Strong', label: 'Strong' },
              ]}
            />
          </div>
        </div>
      </details>

      <div className="vocab-list-meta">
        <p className="vocab-count">
          {resultCount}
          {resultCount !== totalCount ? ` of ${totalCount}` : ''} term
          {resultCount === 1 ? '' : 's'}
        </p>
        <div className="vocab-sort" role="group" aria-label="Sort word list">
          <span className="vocab-sort-label">Sort</span>
          <div className="vocab-sort-pills">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`vocab-sort-pill ${sortMode === opt.id ? 'on' : ''}`}
                aria-pressed={sortMode === opt.id}
                title={
                  opt.id === 'random' && sortMode === 'random'
                    ? 'Shuffle again'
                    : opt.title
                }
                onClick={() => {
                  if (
                    opt.id === 'random' &&
                    sortMode === 'random' &&
                    onReshuffle
                  ) {
                    onReshuffle()
                  } else {
                    onSortMode(opt.id)
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Optional wrapper if a parent needs custom footer content under filters. */
export function VocabBrowseShell({ children }: { children: ReactNode }) {
  return <div className="vocab-browse-shell">{children}</div>
}
