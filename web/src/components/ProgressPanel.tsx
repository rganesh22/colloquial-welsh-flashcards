import { useMemo, useState } from 'react'
import type { DirectionMode, ProgressMap, VocabCard } from '../lib/types'
import { formatPosList, showsGender } from '../lib/pos'
import { getLesson } from '../lib/lessons'
import {
  getHardVocab,
  introHistoryTotals,
  strengthForVocab,
  strengthLabel,
  vocabStatusLabel,
  vocabStudyStatus,
} from '../lib/srs'
import {
  MultiSearch,
  MultiSelect,
  matchesSearchTokens,
} from './MultiSelect'
import { ContribCalendar } from './ContribCalendar'

export function ProgressPanel({
  open,
  onClose,
  progress,
  direction,
}: {
  open: boolean
  onClose: () => void
  progress: ProgressMap
  direction: DirectionMode
}) {
  const totals = useMemo(() => introHistoryTotals(365), [open, progress])
  const hardAll = useMemo(
    () => getHardVocab(progress, direction),
    [progress, direction],
  )

  const [hardTokens, setHardTokens] = useState<string[]>([])
  const [hardStrength, setHardStrength] = useState<string[]>([])
  const [hardStatus, setHardStatus] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(true)

  const hardFiltered = useMemo(() => {
    return hardAll.filter((row) => {
      const c = row.card
      const hay = [
        c.welsh,
        c.english,
        c.plural ?? '',
        c.notes ?? '',
        c.sense ?? '',
      ].join(' ')
      if (!matchesSearchTokens(hay, hardTokens)) return false
      if (
        hardStrength.length > 0 &&
        !hardStrength.includes(strengthLabel(row.strength))
      ) {
        return false
      }
      const status = vocabStudyStatus(progress, c.id, direction)
      if (hardStatus.length > 0 && !hardStatus.includes(status)) return false
      return true
    })
  }, [hardAll, hardTokens, hardStrength, hardStatus, progress, direction])

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel progress-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-panel-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <h2 id="progress-panel-title">Learning trajectory</h2>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="progress-stats">
          <div className="progress-stat">
            <span className="progress-stat-value">{totals.total}</span>
            <span className="progress-stat-label">Words learned</span>
          </div>
          <div className="progress-stat">
            <span className="progress-stat-value">{totals.thisWeek}</span>
            <span className="progress-stat-label">This week</span>
          </div>
          <div className="progress-stat">
            <span className="progress-stat-value">{totals.streak}</span>
            <span className="progress-stat-label">Day streak</span>
          </div>
          <div className="progress-stat">
            <span className="progress-stat-value">{totals.bestDay}</span>
            <span className="progress-stat-label">Best day</span>
          </div>
        </div>

        <ContribCalendar refreshKey={`${open}-${totals.total}-${totals.thisWeek}`} />

        <section className="hard-section">
          <h3 className="contrib-heading">Hard words</h3>
          <p className="muted-line hard-lead">
            Cards with lapses or low strength — filter and browse.
          </p>

          <details
            className="vocab-filter-fold"
            open={filtersOpen}
            onToggle={(e) =>
              setFiltersOpen((e.target as HTMLDetailsElement).open)
            }
          >
            <summary>
              Search & filters
              {(hardTokens.length > 0 ||
                hardStrength.length > 0 ||
                hardStatus.length > 0) && (
                <span className="fold-badge">active</span>
              )}
            </summary>
            <div className="vocab-toolbar folded">
              <MultiSearch
                tokens={hardTokens}
                onChange={setHardTokens}
                placeholder="Search hard words…"
                aria-label="Search hard vocabulary"
              />
              <div className="vocab-filters">
                <MultiSelect
                  label="Status"
                  values={hardStatus}
                  onChange={setHardStatus}
                  options={[
                    { value: 'due', label: 'Due' },
                    { value: 'learning', label: 'Learning' },
                    { value: 'new', label: 'New' },
                    { value: 'review', label: 'Review' },
                  ]}
                />
                <MultiSelect
                  label="Strength"
                  values={hardStrength}
                  onChange={setHardStrength}
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

          <p className="vocab-count">
            {hardFiltered.length} of {hardAll.length}
          </p>

          <ul className="hard-list">
            {hardFiltered.length === 0 ? (
              <li className="term-empty">No hard words match.</li>
            ) : (
              hardFiltered.slice(0, 80).map((row) => (
                <HardCardPreview
                  key={row.card.id}
                  card={row.card}
                  progress={progress}
                  direction={direction}
                  lapses={row.lapses}
                />
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  )
}

function HardCardPreview({
  card,
  progress,
  direction,
  lapses,
}: {
  card: VocabCard
  progress: ProgressMap
  direction: DirectionMode
  lapses: number
}) {
  const [flipped, setFlipped] = useState(false)
  const score = strengthForVocab(progress, card.id, direction)
  const status = vocabStudyStatus(progress, card.id, direction)
  const lesson = getLesson(card.bookId, card.lessonId)
  const pos = formatPosList(card.pos)

  return (
    <li>
      <button
        type="button"
        className={`hard-card ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="hard-card-top">
          <span className="hard-lesson">{lesson?.id ?? card.lessonId}</span>
          <span className="status-chip" data-status={status}>
            {vocabStatusLabel(status)}
          </span>
          {lapses > 0 && (
            <span className="hard-lapses">
              {lapses} lapse{lapses === 1 ? '' : 's'}
            </span>
          )}
        </div>
        {!flipped ? (
          <>
            <span className="hard-cy">{card.welsh}</span>
            <span className="hard-hint">Tap to reveal</span>
          </>
        ) : (
          <>
            <span className="hard-cy">{card.welsh}</span>
            <span className="hard-en">{card.english}</span>
            {card.plural && (
              <span className="hard-pl">pl. {card.plural}</span>
            )}
            {(pos.length > 0 || showsGender(card)) && (
              <span className="hard-meta">
                {pos.join(' · ')}
                {showsGender(card) && card.gender ? ` · ${card.gender}` : ''}
              </span>
            )}
          </>
        )}
        <span
          className="term-mastery-track hard-bar"
          title={strengthLabel(score)}
        >
          <span
            className="term-mastery-fill"
            style={{ width: `${Math.round(score * 100)}%` }}
          />
        </span>
      </button>
    </li>
  )
}
