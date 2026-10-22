import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { ALL_CARDS } from '../data/deck'
import {
  formatIntroDate,
  getIntroDayDetail,
  getMonthIntroCells,
  getWeekIntroCells,
  getYearIntroCells,
  monthIntroTotal,
  monthLabel,
  type IntroDayCell,
  type IntroDayDetail,
} from '../lib/srs'

export type CalendarScope = 'week' | 'month' | 'year'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function chunkWeeks(cells: IntroDayCell[]): IntroDayCell[][] {
  const weeks: IntroDayCell[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

function cardLabel(id: string): { welsh: string; english: string } | null {
  const c = ALL_CARDS.find((x) => x.id === id)
  if (!c) return null
  return { welsh: c.welsh, english: c.english }
}

export function ContribCalendar({ refreshKey }: { refreshKey?: unknown }) {
  const now = new Date()
  const [scope, setScope] = useState<CalendarScope>('month')
  const [cursor, setCursor] = useState(
    () => new Date(now.getFullYear(), now.getMonth(), 1),
  )
  const [selected, setSelected] = useState<IntroDayDetail | null>(null)
  const [hover, setHover] = useState<{
    cell: IntroDayCell
    x: number
    y: number
  } | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Re-sync when panel opens / progress changes
    void refreshKey
  }, [refreshKey])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const monthCells = useMemo(
    () => getMonthIntroCells(year, month),
    [year, month, refreshKey],
  )
  const weekCells = useMemo(
    () => getWeekIntroCells(cursor),
    [cursor, refreshKey],
  )
  const yearCells = useMemo(
    () => getYearIntroCells(year),
    [year, refreshKey],
  )
  const monthTotal = useMemo(
    () => monthIntroTotal(year, month),
    [year, month, refreshKey],
  )

  function shift(delta: number) {
    setSelected(null)
    setHover(null)
    setCursor((c) => {
      if (scope === 'week') {
        const next = new Date(c)
        next.setDate(next.getDate() + delta * 7)
        return next
      }
      if (scope === 'year') {
        return new Date(c.getFullYear() + delta, 0, 1)
      }
      return new Date(c.getFullYear(), c.getMonth() + delta, 1)
    })
  }

  function selectDay(cell: IntroDayCell) {
    if (cell.outside && scope === 'month') {
      // Jump to that month when clicking padding days
      const [y, m] = cell.date.split('-').map(Number)
      setCursor(new Date(y!, m! - 1, 1))
    }
    setSelected(getIntroDayDetail(cell.date))
  }

  function onDayMove(e: MouseEvent, cell: IntroDayCell) {
    const root = wrapRef.current?.getBoundingClientRect()
    if (!root) return
    setHover({
      cell,
      x: e.clientX - root.left,
      y: e.clientY - root.top,
    })
  }

  const heading =
    scope === 'week'
      ? `Week of ${formatIntroDate(weekCells[0]?.date ?? '')}`
      : scope === 'year'
        ? `${year}`
        : monthLabel(year, month)

  const sub =
    scope === 'month'
      ? `${monthTotal} new this month`
      : scope === 'week'
        ? `${weekCells.reduce((s, c) => s + c.count, 0)} new this week`
        : `${yearCells.filter((c) => !c.outside).reduce((s, c) => s + c.count, 0)} new in view`

  return (
    <section className="contrib-section" ref={wrapRef}>
      <div className="contrib-toolbar">
        <div className="contrib-scopes" role="tablist" aria-label="Time scope">
          {(['week', 'month', 'year'] as CalendarScope[]).map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={scope === s}
              className={`contrib-scope ${scope === s ? 'on' : ''}`}
              onClick={() => {
                setScope(s)
                setSelected(null)
                setHover(null)
                if (s === 'month') {
                  setCursor(new Date(now.getFullYear(), now.getMonth(), 1))
                } else if (s === 'year') {
                  setCursor(new Date(now.getFullYear(), 0, 1))
                } else {
                  setCursor(new Date())
                }
              }}
            >
              {s === 'week' ? 'Week' : s === 'month' ? 'Month' : 'Year'}
            </button>
          ))}
        </div>
        <div className="contrib-nav">
          <button
            type="button"
            className="contrib-nav-btn"
            onClick={() => shift(-1)}
            aria-label="Previous"
          >
            ‹
          </button>
          <div className="contrib-heading-block">
            <h3 className="contrib-heading">{heading}</h3>
            <p className="contrib-sub">{sub}</p>
          </div>
          <button
            type="button"
            className="contrib-nav-btn"
            onClick={() => shift(1)}
            aria-label="Next"
          >
            ›
          </button>
          <button
            type="button"
            className="ghost-btn contrib-today"
            onClick={() => {
              setSelected(null)
              if (scope === 'year') setCursor(new Date(now.getFullYear(), 0, 1))
              else if (scope === 'month')
                setCursor(new Date(now.getFullYear(), now.getMonth(), 1))
              else setCursor(new Date())
            }}
          >
            Today
          </button>
        </div>
      </div>

      {scope === 'month' && (
        <MonthGrid
          cells={monthCells}
          selectedDate={selected?.date}
          onSelect={selectDay}
          onHover={onDayMove}
          onLeave={() => setHover(null)}
        />
      )}
      {scope === 'week' && (
        <WeekGrid
          cells={weekCells}
          selectedDate={selected?.date}
          onSelect={selectDay}
          onHover={onDayMove}
          onLeave={() => setHover(null)}
        />
      )}
      {scope === 'year' && (
        <YearHeatmap
          cells={yearCells}
          selectedDate={selected?.date}
          onSelect={selectDay}
          onHover={onDayMove}
          onLeave={() => setHover(null)}
        />
      )}

      <div className="contrib-legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="contrib-swatch" data-level={l} />
        ))}
        <span>More</span>
      </div>

      {hover && (
        <div
          className="contrib-tooltip"
          style={{
            left: Math.min(
              Math.max(12, hover.x + 14),
              (wrapRef.current?.clientWidth ?? 320) - 160,
            ),
            top: Math.max(8, hover.y - 48),
          }}
          role="tooltip"
        >
          <strong>{formatIntroDate(hover.cell.date)}</strong>
          <span>
            {hover.cell.count === 0
              ? 'No new words'
              : `${hover.cell.count} new word${hover.cell.count === 1 ? '' : 's'}`}
          </span>
        </div>
      )}

      {selected && (
        <DayDetail
          detail={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  )
}

function MonthGrid({
  cells,
  selectedDate,
  onSelect,
  onHover,
  onLeave,
}: {
  cells: IntroDayCell[]
  selectedDate?: string
  onSelect: (c: IntroDayCell) => void
  onHover: (e: MouseEvent, c: IntroDayCell) => void
  onLeave: () => void
}) {
  return (
    <div className="cal-month" onMouseLeave={onLeave}>
      <div className="cal-weekdays">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="cal-days">
        {cells.map((cell) => {
          const dayNum = Number(cell.date.slice(-2))
          const isToday = cell.date === todayKeyLocal()
          return (
            <button
              key={cell.date + (cell.outside ? '-o' : '')}
              type="button"
              className={`cal-day ${cell.outside ? 'outside' : ''} ${selectedDate === cell.date ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              data-level={cell.level}
              onClick={() => onSelect(cell)}
              onMouseEnter={(e) => onHover(e, cell)}
              onMouseMove={(e) => onHover(e, cell)}
              aria-label={`${formatIntroDate(cell.date)}: ${cell.count} new`}
            >
              <span className="cal-day-num">{dayNum}</span>
              {cell.count > 0 && (
                <span className="cal-day-count">{cell.count}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function WeekGrid({
  cells,
  selectedDate,
  onSelect,
  onHover,
  onLeave,
}: {
  cells: IntroDayCell[]
  selectedDate?: string
  onSelect: (c: IntroDayCell) => void
  onHover: (e: MouseEvent, c: IntroDayCell) => void
  onLeave: () => void
}) {
  return (
    <div className="cal-week" onMouseLeave={onLeave}>
      {cells.map((cell, i) => {
        const isToday = cell.date === todayKeyLocal()
        return (
          <button
            key={cell.date}
            type="button"
            className={`cal-week-day ${selectedDate === cell.date ? 'selected' : ''} ${isToday ? 'today' : ''}`}
            data-level={cell.level}
            onClick={() => onSelect(cell)}
            onMouseEnter={(e) => onHover(e, cell)}
            onMouseMove={(e) => onHover(e, cell)}
            aria-label={`${formatIntroDate(cell.date)}: ${cell.count} new`}
          >
            <span className="cal-week-label">{WEEKDAYS[i]}</span>
            <span className="cal-week-num">{Number(cell.date.slice(-2))}</span>
            <span className="cal-week-count">
              {cell.count === 0 ? '—' : cell.count}
            </span>
            <span className="cal-week-unit">
              {cell.count === 1 ? 'word' : 'words'}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function YearHeatmap({
  cells,
  selectedDate,
  onSelect,
  onHover,
  onLeave,
}: {
  cells: IntroDayCell[]
  selectedDate?: string
  onSelect: (c: IntroDayCell) => void
  onHover: (e: MouseEvent, c: IntroDayCell) => void
  onLeave: () => void
}) {
  const weeks = chunkWeeks(cells)
  return (
    <div className="cal-year" onMouseLeave={onLeave}>
      <div className="contrib-grid year-grid" role="grid" aria-label="Year heatmap">
        {weeks.map((week, wi) => (
          <div key={wi} className="contrib-week">
            {week.map((cell) => (
              <button
                key={cell.date + (cell.outside ? '-p' : '')}
                type="button"
                className={`contrib-day interactive ${cell.outside ? 'outside' : ''} ${selectedDate === cell.date ? 'selected' : ''}`}
                data-level={cell.level}
                onClick={() => onSelect(cell)}
                onMouseEnter={(e) => onHover(e, cell)}
                onMouseMove={(e) => onHover(e, cell)}
                aria-label={`${formatIntroDate(cell.date)}: ${cell.count} new`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function DayDetail({
  detail,
  onClose,
}: {
  detail: IntroDayDetail
  onClose: () => void
}) {
  const words = detail.ids
    .map((id) => ({ id, ...cardLabel(id) }))
    .filter((w): w is { id: string; welsh: string; english: string } =>
      Boolean(w.welsh),
    )

  return (
    <div className="day-detail" key={detail.date}>
      <div className="day-detail-head">
        <div>
          <h4>{formatIntroDate(detail.date)}</h4>
          <p>
            {detail.count === 0
              ? 'No new words this day'
              : `${detail.count} new word${detail.count === 1 ? '' : 's'}`}
          </p>
        </div>
        <button type="button" className="ghost-btn" onClick={onClose}>
          Close
        </button>
      </div>
      {words.length > 0 ? (
        <ul className="day-detail-words">
          {words.map((w) => (
            <li key={w.id}>
              <span className="cy">{w.welsh}</span>
              <span className="en">{w.english}</span>
            </li>
          ))}
        </ul>
      ) : detail.count > 0 ? (
        <p className="muted-line day-detail-note">
          Count is saved for this day, but individual words weren’t logged yet.
          New words going forward will appear here.
        </p>
      ) : null}
    </div>
  )
}

function todayKeyLocal(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
