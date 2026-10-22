import type { ActivityKind, BookId, DirectionMode, ProgressMap } from '../lib/types'
import { getBook, getLesson } from '../lib/lessons'
import {
  getSeenGenderedVocab,
  getSeenVocab,
} from '../lib/srs'
import { GenderQuiz } from './GenderQuiz'
import { MatchGame } from './MatchGame'
import { ListenChoose } from './ListenChoose'
import { PluralQuiz } from './PluralQuiz'

const TITLES: Record<ActivityKind, { cy: string; en: string }> = {
  gender: { cy: 'Rhyw', en: 'Gender' },
  match: { cy: 'Paru', en: 'Match' },
  listen: { cy: 'Gwrando', en: 'Listen & choose' },
  plurals: { cy: 'Lluosogion', en: 'Plurals' },
}

export function ActivityView({
  activity,
  bookId,
  lessonId,
  progress,
  direction,
  apiKey,
}: {
  activity: ActivityKind
  bookId: BookId
  lessonId: string
  progress: ProgressMap
  direction: DirectionMode
  apiKey: string
}) {
  const lesson = getLesson(bookId, lessonId)
  const filter = { kind: 'lesson' as const, bookId, lessonId }
  const seen = getSeenVocab(progress, filter, direction)
  const gendered = getSeenGenderedVocab(progress, filter, direction)
  const plurals = seen.filter((c) => Boolean(c.plural))
  const title = TITLES[activity]

  return (
    <div className="activity-page">
      <p className="book-kicker">
        {getBook(bookId).title} · {lesson?.id}
      </p>
      <h1 className="page-title">{title.cy}</h1>
      <p className="page-lead">
        {title.en} · practice seen cards · shortcuts on buttons ·{' '}
        <kbd>E</kbd> next
        if wrong · <kbd>R</kbd> speak
      </p>

      <div className="activity-stage">
        {activity === 'gender' && (
          <GenderQuiz cards={gendered} apiKey={apiKey} />
        )}
        {activity === 'match' && <MatchGame cards={seen} />}
        {activity === 'listen' && (
          <ListenChoose cards={seen} apiKey={apiKey} />
        )}
        {activity === 'plurals' && (
          <PluralQuiz cards={plurals} apiKey={apiKey} />
        )}
      </div>
    </div>
  )
}
