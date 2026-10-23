import { useEffect, useMemo, useRef, useState } from 'react'
import type { Grade } from 'ts-fsrs'
import { Rating } from 'ts-fsrs'
import type {
  ActivityKind,
  AppView,
  BookId,
  DirectionMode,
  LessonId,
  ProgressMap,
  SessionFilter,
  StudyItem,
  VocabCard,
} from './lib/types'
import { formatPosList, showsGender } from './lib/pos'
import {
  RATING_META,
  advanceLearnWave,
  answerFor,
  applyRating,
  applyTheme,
  buildQueue,
  clampDailyWordGoal,
  clampLearnBatchSize,
  clampMaxDailyReviews,
  clampDailySessions,
  countNewItems,
  countStats,
  countHeadwordStats,
  dailyIntroCount,
  dailyReviewCount,
  defaultMaxDailyReviews,
  dialectLabel,
  directionLabel,
  formatInterval,
  getLearningItems,
  getOrderedNewVocab,
  getSeenGenderedVocab,
  getSeenVocab,
  isFirstVocabIntroduction,
  isNew,
  loadProgress,
  loadSettings,
  nextLearningDueAt,
  previewIntervals,
  progressCardCount,
  promptFor,
  recordDailyIntroduced,
  recordDailyReview,
  remainingDailyGoal,
  remainingDailyReviews,
  exportProgressBackup,
  importProgressBackup,
  saveProgress,
  saveSettings,
  senseFor,
  sessionWordQuota,
  sessionReviewQuota,
  buildDaySegments,
  effectiveSessionReviewMax,
  strengthForCard,
  strengthForVocab,
  strengthLabel,
  vocabStatusLabel,
  vocabStudyStatus,
  welshTextFor,
  type AppSettings,
  type DaySegment,
} from './lib/srs'
import { BOOKS, getBook, getLesson, LESSONS } from './lib/lessons'
import { cardsForLesson } from './data/deck'
import { getApiKey, ASK_MODELS, clampAskModel, clampAskTemperature } from './lib/gemini'
import { speakWelsh } from './lib/tts'
import { useKeydown } from './lib/keys'
import { formatElapsed } from './lib/format'
import {
  accountSyncEnabled,
  flushAccountSync,
  signInWithGoogle,
  signOutAccount,
  subscribeAccount,
  type AccountPhase,
  type AccountUser,
} from './lib/account'
import { AccountBar, SignInGate } from './components/AccountBar'
import { ActivityView } from './components/ActivityView'
import { ChapterGuideView } from './components/ChapterGuideView'
import { getChapterGuide } from './data/guides'
import { AskPanel } from './components/AskPanel'
import { MutationsView } from './components/MutationsView'
import { ProgressPanel } from './components/ProgressPanel'
import { SpeakButton } from './components/SpeakButton'
import {
  StudyActivityBreak,
  pickLearnActivity,
} from './components/StudyActivityBreak'
import { VocabBrowseControls, type VocabSortMode } from './components/VocabBrowseControls'
import { matchesSearchTokens } from './components/MultiSelect'
import './App.css'

export default function App() {
  const [view, setView] = useState<AppView>({ name: 'home' })
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress())
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings())
  const [askOpen, setAskOpen] = useState(false)
  const [askContext, setAskContext] = useState<string | undefined>()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [progressOpen, setProgressOpen] = useState(false)
  const syncOn = accountSyncEnabled()
  const [accountPhase, setAccountPhase] = useState<AccountPhase>(
    syncOn ? 'checking' : 'off',
  )
  const [accountDetail, setAccountDetail] = useState(
    syncOn ? 'Checking your account…' : 'Saved in this browser',
  )
  const [accountUser, setAccountUser] = useState<AccountUser | null>(null)

  useEffect(() => {
    applyTheme(settings.theme)
  }, [settings.theme])

  const overall = useMemo(
    () => countStats(progress, { kind: 'all' }, settings.direction),
    [progress, settings.direction],
  )
  const headStats = useMemo(
    () => countHeadwordStats(progress, { kind: 'all' }, settings.direction),
    [progress, settings.direction],
  )

  function updateSettings(patch: Partial<AppSettings>) {
    const next = { ...settings, ...patch }
    setSettings(next)
    saveSettings(next)
    if (patch.theme) applyTheme(patch.theme)
  }

  /** Always write FSRS state to localStorage when progress changes. */
  function updateProgress(next: ProgressMap) {
    saveProgress(next)
    setProgress(next)
  }

  useEffect(() => {
    function flush() {
      // Never flush an empty in-memory map over a populated save.
      if (
        Object.keys(progress).length === 0 &&
        progressCardCount(loadProgress()) > 0
      ) {
        return
      }
      saveProgress(progress)
      flushAccountSync()
    }
    const onHide = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [progress])

  useEffect(() => {
    return subscribeAccount({
      onSession: setAccountUser,
      onStatus: (phase, detail) => {
        setAccountPhase(phase)
        setAccountDetail(detail)
      },
      onApplied: (nextProgress, nextSettings) => {
        setProgress(nextProgress)
        setSettings(nextSettings)
        applyTheme(nextSettings.theme)
      },
    })
  }, [])

  // If React somehow started empty but localStorage still has data, restore it.
  useEffect(() => {
    if (Object.keys(progress).length > 0) return
    const saved = loadProgress()
    if (Object.keys(saved).length > 0) setProgress(saved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openAsk(context?: string) {
    setAskContext(context)
    setAskOpen(true)
  }

  function goBackFromView() {
    if (askOpen) {
      setAskOpen(false)
      return
    }
    if (progressOpen) {
      setProgressOpen(false)
      return
    }
    if (settingsOpen) {
      setSettingsOpen(false)
      return
    }
    if (view.name === 'home') return
    if (view.name === 'study' && view.filter.kind === 'lesson') {
      setView({
        name: 'lesson',
        bookId: view.filter.bookId,
        lessonId: view.filter.lessonId,
      })
      return
    }
    if (view.name === 'activity') {
      setView({
        name: 'lesson',
        bookId: view.bookId,
        lessonId: view.lessonId,
      })
      return
    }
    if (view.name === 'guide') {
      setView({
        name: 'lesson',
        bookId: view.bookId,
        lessonId: view.lessonId,
      })
      return
    }
    setView({ name: 'home' })
  }

  function startGoalSegment(segment: DaySegment) {
    if (segment.status !== 'current' || segment.wordsLeft <= 0) return
    const remaining = remainingDailyGoal(settings.dailyWordGoal)
    const quota = sessionWordQuota(
      settings.dailyWordGoal,
      settings.dailySessions,
      remaining,
      segment.index,
    )
    const pool = getOrderedNewVocab(progress, settings.direction, quota)
    if (pool.length === 0) return
    const sessionReviewMax = effectiveSessionReviewMax(
      settings.maxDailyReviews,
      settings.dailySessions,
      dailyReviewCount(),
      segment.index,
    )
    setView({
      name: 'study',
      mode: 'learn',
      filter: { kind: 'all' },
      quotaCardIds: pool.map((c) => c.id),
      sessionReviewMax,
      segmentIndex: segment.index,
      segmentLabel: segment.label,
    })
  }

  const locked = syncOn && !accountUser

  useKeydown(
    (e) => {
      if (locked) return
      if (e.key === 'Escape') {
        // Study view owns Escape (activity skip / exit).
        if (view.name === 'study') return
        e.preventDefault()
        goBackFromView()
        return
      }
      if (askOpen || progressOpen || settingsOpen) return
      if (view.name !== 'home') return
      if (e.key === '1') {
        e.preventDefault()
        const segs = buildDaySegments(
          settings.dailyWordGoal,
          settings.dailySessions,
          dailyIntroCount(),
        )
        const current = segs.find((s) => s.status === 'current')
        if (current) startGoalSegment(current)
      } else if (e.key === '2') {
        e.preventDefault()
        if (overall.due === 0) return
        setView({
          name: 'study',
          mode: 'review',
          filter: { kind: 'all' },
        })
      } else if (e.key === '3') {
        e.preventDefault()
        if (overall.new === 0) return
        setView({
          name: 'study',
          mode: 'learn',
          filter: { kind: 'all' },
        })
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        setProgressOpen(true)
      } else if (e.key === ',' || e.key === '/') {
        e.preventDefault()
        setSettingsOpen(true)
      }
    },
    [
      askOpen,
      progressOpen,
      settingsOpen,
      view,
      settings,
      progress,
      overall,
      locked,
    ],
  )

  if (locked) {
    return (
      <SignInGate
        phase={accountPhase}
        detail={accountDetail}
        onSignIn={() => {
          void signInWithGoogle()
        }}
      />
    )
  }

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true" />
      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => setView({ name: 'home' })}
        >
          <span className="brand-mark">WF</span>
          <span className="brand-name">Welsh Flashcards</span>
        </button>
        <div className="top-actions">
          <AccountBar
            phase={accountPhase}
            detail={accountDetail}
            user={accountUser}
            onSignIn={() => {
              void signInWithGoogle()
            }}
            onSignOut={() => {
              void signOutAccount()
            }}
          />
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setView({ name: 'mutations' })}
          >
            Mutations
          </button>
          <button type="button" className="ghost-btn" onClick={() => openAsk()}>
            Ask
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setProgressOpen(true)}
          >
            Progress
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setSettingsOpen((v) => !v)}
          >
            Settings
          </button>
          {view.name !== 'home' && (
            <button
              type="button"
              className="ghost-btn"
              onClick={() =>
                setView(
                  view.name === 'study' && view.filter.kind === 'lesson'
                    ? {
                        name: 'lesson',
                        bookId: view.filter.bookId,
                        lessonId: view.filter.lessonId,
                      }
                    : view.name === 'activity'
                      ? {
                          name: 'lesson',
                          bookId: view.bookId,
                          lessonId: view.lessonId,
                        }
                      : { name: 'home' },
                )
              }
            >
              Back
            </button>
          )}
        </div>
      </header>

      {settingsOpen && (
        <SettingsBar
          settings={settings}
          onSettings={updateSettings}
          onClose={() => setSettingsOpen(false)}
          onImportProgress={(next) => {
            saveProgress(next)
            setProgress(next)
          }}
        />
      )}

      <main className="main">
        {view.name === 'home' && (
          <HomeView
            overall={overall}
            headStats={headStats}
            settings={settings}
            onSettings={updateSettings}
            onLearnSegment={startGoalSegment}
            onReviewDue={() =>
              setView({
                name: 'study',
                mode: 'review',
                filter: { kind: 'all' },
              })
            }
            onFreeLearn={() =>
              setView({
                name: 'study',
                mode: 'learn',
                filter: { kind: 'all' },
              })
            }
            onOpenLesson={(bookId, lessonId) =>
              setView({ name: 'lesson', bookId, lessonId })
            }
            progress={progress}
          />
        )}
        {view.name === 'mutations' && <MutationsView />}
        {view.name === 'guide' && (
          <ChapterGuideView
            lesson={getLesson(view.bookId, view.lessonId)!}
            guide={getChapterGuide(view.bookId, view.lessonId) ?? null}
            apiKey={settings.apiKey}
            onClose={() =>
              setView({
                name: 'lesson',
                bookId: view.bookId,
                lessonId: view.lessonId,
              })
            }
            onPractice={() =>
              setView({
                name: 'study',
                mode: 'learn',
                filter: {
                  kind: 'lesson',
                  bookId: view.bookId,
                  lessonId: view.lessonId,
                },
              })
            }
          />
        )}
        {view.name === 'lesson' && (
          <LessonView
            bookId={view.bookId}
            lessonId={view.lessonId}
            progress={progress}
            direction={settings.direction}
            apiKey={settings.apiKey}
            listenActivities={settings.listenActivities}
            onLearn={() =>
              setView({
                name: 'study',
                mode: 'learn',
                filter: {
                  kind: 'lesson',
                  bookId: view.bookId,
                  lessonId: view.lessonId,
                },
              })
            }
            onReview={() =>
              setView({
                name: 'study',
                mode: 'review',
                filter: {
                  kind: 'lesson',
                  bookId: view.bookId,
                  lessonId: view.lessonId,
                },
              })
            }
            onActivity={(activity) =>
              setView({
                name: 'activity',
                activity,
                bookId: view.bookId,
                lessonId: view.lessonId,
              })
            }
            onOpenGuide={
              getChapterGuide(view.bookId, view.lessonId)
                ? () =>
                    setView({
                      name: 'guide',
                      bookId: view.bookId,
                      lessonId: view.lessonId,
                    })
                : undefined
            }
          />
        )}
        {view.name === 'activity' && (
          <ActivityView
            activity={view.activity}
            bookId={view.bookId}
            lessonId={view.lessonId}
            progress={progress}
            direction={settings.direction}
            apiKey={settings.apiKey}
          />
        )}
        {view.name === 'study' && (
          <StudyView
            mode={view.mode}
            filter={view.filter}
            quotaCardIds={view.quotaCardIds}
            sessionReviewMax={view.sessionReviewMax}
            segmentLabel={view.segmentLabel}
            progress={progress}
            settings={settings}
            onProgress={updateProgress}
            onAsk={openAsk}
            onExit={() =>
              setView(
                view.filter.kind === 'lesson'
                  ? {
                      name: 'lesson',
                      bookId: view.filter.bookId,
                      lessonId: view.filter.lessonId,
                    }
                  : { name: 'home' },
              )
            }
          />
        )}
      </main>

      <AskPanel
        open={askOpen}
        onClose={() => setAskOpen(false)}
        onOpen={() => setAskOpen(true)}
        apiKeyStored={settings.apiKey}
        context={askContext}
        model={settings.askModel}
        temperature={settings.askTemperature}
        onSettings={updateSettings}
      />
      <ProgressPanel
        open={progressOpen}
        onClose={() => setProgressOpen(false)}
        progress={progress}
        direction={settings.direction}
      />
    </div>
  )
}

function SettingsBar({
  settings,
  onSettings,
  onClose,
  onImportProgress,
}: {
  settings: AppSettings
  onSettings: (p: Partial<AppSettings>) => void
  onClose: () => void
  onImportProgress: (progress: ProgressMap) => void
}) {
  const envReady = Boolean(getApiKey(''))
  const fileRef = useRef<HTMLInputElement>(null)
  const savedCount = progressCardCount(loadProgress())

  function downloadBackup() {
    const blob = new Blob([exportProgressBackup()], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `welsh-flashcards-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onPickBackup(file: File | null) {
    if (!file) return
    try {
      const text = await file.text()
      const { progress, cards } = importProgressBackup(text)
      onImportProgress(progress)
      window.alert(`Restored ${cards} scheduled cards from backup.`)
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : 'Could not import backup',
      )
    }
  }

  return (
    <div className="settings-bar">
      <label>
        Theme
        <select
          value={settings.theme}
          onChange={(e) =>
            onSettings({ theme: e.target.value as AppSettings['theme'] })
          }
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </label>
      <label>
        Direction
        <select
          value={settings.direction}
          onChange={(e) =>
            onSettings({ direction: e.target.value as DirectionMode })
          }
        >
          <option value="both">Both ways</option>
          <option value="cy-en">Welsh → English</option>
          <option value="en-cy">English → Welsh</option>
        </select>
      </label>
      <label>
        New / set
        <input
          type="number"
          min={1}
          max={50}
          step={1}
          value={settings.learnBatchSize}
          onChange={(e) =>
            onSettings({
              learnBatchSize: clampLearnBatchSize(Number(e.target.value)),
            })
          }
        />
      </label>
      <label>
        Daily word goal
        <input
          type="number"
          min={5}
          max={200}
          step={5}
          value={settings.dailyWordGoal}
          onChange={(e) => {
            const dailyWordGoal = clampDailyWordGoal(Number(e.target.value))
            const prevDefault = defaultMaxDailyReviews(settings.dailyWordGoal)
            const patch: Partial<AppSettings> = { dailyWordGoal }
            if (settings.maxDailyReviews === prevDefault) {
              patch.maxDailyReviews = defaultMaxDailyReviews(dailyWordGoal)
            }
            onSettings(patch)
          }}
        />
      </label>
      <label>
        Sessions / day
        <input
          type="number"
          min={1}
          max={20}
          step={1}
          value={settings.dailySessions}
          onChange={(e) =>
            onSettings({
              dailySessions: clampDailySessions(Number(e.target.value)),
            })
          }
          title="Split the daily word goal across this many Learn sessions"
        />
      </label>
      <label>
        Max reviews / day
        <input
          type="number"
          min={0}
          max={2000}
          step={10}
          value={settings.maxDailyReviews}
          onChange={(e) =>
            onSettings({
              maxDailyReviews: clampMaxDailyReviews(Number(e.target.value)),
            })
          }
          title="Default is 10× daily word goal"
        />
      </label>
      <label className="settings-check">
        <span>Activities in Learn</span>
        <input
          type="checkbox"
          checked={settings.learnActivities}
          onChange={(e) =>
            onSettings({ learnActivities: e.target.checked })
          }
        />
      </label>
      <label className="settings-check">
        <span>Listening activities</span>
        <input
          type="checkbox"
          checked={settings.listenActivities}
          onChange={(e) =>
            onSettings({ listenActivities: e.target.checked })
          }
          title="Turn off when you can’t play audio"
        />
      </label>
      <label>
        Ask model
        <select
          value={clampAskModel(settings.askModel)}
          onChange={(e) =>
            onSettings({ askModel: clampAskModel(e.target.value) })
          }
        >
          {ASK_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Ask creativity
        <input
          type="number"
          min={0}
          max={1.2}
          step={0.1}
          value={clampAskTemperature(settings.askTemperature)}
          onChange={(e) =>
            onSettings({
              askTemperature: clampAskTemperature(Number(e.target.value)),
            })
          }
        />
      </label>
      <label className="grow">
        Gemini key
        <input
          type="password"
          autoComplete="off"
          placeholder={envReady ? 'Using env key' : 'AIza…'}
          value={settings.apiKey}
          onChange={(e) => onSettings({ apiKey: e.target.value })}
        />
      </label>
      <div className="settings-backup">
        <span className="settings-backup-label">
          Progress backup
          {savedCount > 0 ? ` · ${savedCount} cards saved here` : ' · empty'}
        </span>
        <div className="settings-backup-actions">
          <button type="button" className="ghost-btn" onClick={downloadBackup}>
            Export
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => fileRef.current?.click()}
          >
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              void onPickBackup(e.target.files?.[0] ?? null)
              e.target.value = ''
            }}
          />
        </div>
      </div>
      <button type="button" className="ghost-btn" onClick={onClose}>
        Done
      </button>
    </div>
  )
}

function HomeView({
  overall,
  headStats,
  settings,
  onSettings,
  onLearnSegment,
  onReviewDue,
  onFreeLearn,
  onOpenLesson,
  progress,
}: {
  overall: ReturnType<typeof countStats>
  headStats: ReturnType<typeof countHeadwordStats>
  settings: AppSettings
  onSettings: (p: Partial<AppSettings>) => void
  onLearnSegment: (segment: DaySegment) => void
  onReviewDue: () => void
  onFreeLearn: () => void
  onOpenLesson: (bookId: BookId, lessonId: LessonId) => void
  progress: ProgressMap
}) {
  const introduced = dailyIntroCount()
  const reviewsDone = dailyReviewCount()
  const goal = settings.dailyWordGoal
  const reviewCap = settings.maxDailyReviews
  const remaining = Math.max(0, goal - introduced)
  const reviewsLeft = Math.max(0, reviewCap - reviewsDone)
  const goalDone = remaining === 0
  const reviewsDoneGoal = reviewCap > 0 && reviewsLeft === 0
  const sessions = settings.dailySessions
  const segments = buildDaySegments(goal, sessions, introduced)
  const progressPct = Math.min(100, Math.round((introduced / goal) * 100))
  const reviewPct =
    reviewCap <= 0
      ? 100
      : Math.min(100, Math.round((reviewsDone / reviewCap) * 100))
  const perSessionReviews = Math.ceil(
    reviewCap / Math.max(1, sessions),
  )

  return (
    <div className="home layout-split">
      <section className="hero-block">
        <h1 className="hero-title">Welsh Flashcards</h1>

        <div className="daily-goal-panel">
          <div className="daily-goal-head">
            <span className="daily-goal-label">Today’s targets</span>
            <div className="daily-goal-edits">
              <label className="daily-goal-edit">
                <span className="sr-only">Set daily word goal</span>
                <input
                  type="number"
                  min={5}
                  max={200}
                  step={5}
                  value={goal}
                  onChange={(e) => {
                    const dailyWordGoal = clampDailyWordGoal(
                      Number(e.target.value),
                    )
                    const prevDefault = defaultMaxDailyReviews(goal)
                    const patch: Partial<AppSettings> = { dailyWordGoal }
                    if (settings.maxDailyReviews === prevDefault) {
                      patch.maxDailyReviews =
                        defaultMaxDailyReviews(dailyWordGoal)
                    }
                    onSettings(patch)
                  }}
                />
                <span>words / day</span>
              </label>
              <label className="daily-goal-edit">
                <span className="sr-only">Set max reviews per day</span>
                <input
                  type="number"
                  min={0}
                  max={2000}
                  step={10}
                  value={settings.maxDailyReviews}
                  onChange={(e) =>
                    onSettings({
                      maxDailyReviews: clampMaxDailyReviews(
                        Number(e.target.value),
                      ),
                    })
                  }
                />
                <span>reviews / day</span>
              </label>
            </div>
          </div>
          <div className="daily-goal-meters">
            <div className="daily-goal-meter-block">
              <div className="daily-goal-meter-head">
                <span className="daily-goal-meter-name">Words</span>
                <span className="daily-goal-meter-count">
                  {goalDone ? (
                    <>
                      <span className="section-done-mark" aria-hidden>
                        ✓
                      </span>{' '}
                      {introduced}/{goal}
                    </>
                  ) : (
                    <>
                      {introduced}/{goal}
                      <em> · {remaining} left</em>
                    </>
                  )}
                </span>
              </div>
              <div
                className="daily-goal-meter"
                role="progressbar"
                aria-valuenow={introduced}
                aria-valuemin={0}
                aria-valuemax={goal}
                aria-label={`${introduced} of ${goal} new words today · ${remaining} left`}
              >
                <div
                  className="daily-goal-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <div className="daily-goal-meter-block">
              <div className="daily-goal-meter-head">
                <span className="daily-goal-meter-name">Reviews</span>
                <span className="daily-goal-meter-count">
                  {reviewsDoneGoal ? (
                    <>
                      <span className="section-done-mark" aria-hidden>
                        ✓
                      </span>{' '}
                      {reviewsDone}/{reviewCap}
                    </>
                  ) : (
                    <>
                      {reviewsDone}/{reviewCap}
                      <em> · {reviewsLeft} left</em>
                    </>
                  )}
                </span>
              </div>
              <div
                className={`daily-goal-meter reviews ${reviewsDoneGoal ? 'done' : ''}`}
                role="progressbar"
                aria-valuenow={reviewsDone}
                aria-valuemin={0}
                aria-valuemax={Math.max(reviewCap, 1)}
                aria-label={`${reviewsDone} of ${reviewCap} reviews today · ${reviewsLeft} left`}
              >
                <div
                  className="daily-goal-fill reviews"
                  style={{ width: `${reviewPct}%` }}
                />
              </div>
            </div>
          </div>
          <div className="session-split" role="group" aria-label="Sessions per day">
            <span className="session-split-label">Sessions</span>
            <div className="session-split-pills">
              {([1, 2, 3] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`session-pill ${sessions === n ? 'on' : ''}`}
                  aria-pressed={sessions === n}
                  onClick={() =>
                    onSettings({ dailySessions: clampDailySessions(n) })
                  }
                >
                  {n}
                </button>
              ))}
            </div>
            <label className="session-custom">
              <span className="sr-only">Custom sessions per day</span>
              <input
                type="number"
                min={1}
                max={20}
                step={1}
                value={sessions}
                onChange={(e) =>
                  onSettings({
                    dailySessions: clampDailySessions(Number(e.target.value)),
                  })
                }
              />
            </label>
            {sessions > 1 && (
              <span className="session-split-meta">
                ~{Math.ceil(goal / sessions)} words · ~{perSessionReviews}{' '}
                reviews each
              </span>
            )}
            <label className="settings-check session-listen-toggle">
              <input
                type="checkbox"
                checked={settings.listenActivities}
                onChange={(e) =>
                  onSettings({ listenActivities: e.target.checked })
                }
              />
              <span>Listening drills</span>
            </label>
          </div>
        </div>

        <div className="study-paths" aria-label="Study options">
          <div
            className={`learn-segments ${sessions > 1 ? 'multi' : 'single'}`}
            role="group"
            aria-label="Learn today’s words"
          >
            {segments.map((seg) => {
              const reviewLeft = sessionReviewQuota(
                settings.maxDailyReviews,
                sessions,
                reviewsDone,
                seg.index,
              )
              const disabled =
                seg.status === 'done' ||
                seg.status === 'upcoming' ||
                seg.wordsLeft <= 0
              const isCurrent = seg.status === 'current'
              return (
                <button
                  key={seg.index}
                  type="button"
                  className={`learn-segment-btn ${isCurrent ? 'primary-btn' : 'secondary-btn'} ${seg.status}`}
                  onClick={() => onLearnSegment(seg)}
                  disabled={disabled}
                >
                  <span className="learn-segment-title">
                    {sessions === 1
                      ? 'Learn today’s words'
                      : `Learn · ${seg.label}`}
                    {seg.status === 'done' ? ' ✓' : ''}
                  </span>
                  <span className="btn-meta">
                    {seg.status === 'done'
                      ? `${seg.wordTarget} words done`
                      : seg.status === 'upcoming'
                        ? `Locked · ${seg.wordTarget} words · ≤${reviewLeft} reviews`
                        : sessions === 1
                          ? (
                              <>
                                {seg.wordsLeft} new · ≤{reviewLeft} reviews ·{' '}
                                <kbd>1</kbd>
                              </>
                            )
                          : (
                              <>
                                {seg.wordsLeft} new ({seg.wordStart}–
                                {seg.wordEnd}) · ≤{reviewLeft} reviews
                                {isCurrent ? (
                                  <>
                                    {' · '}
                                    <kbd>1</kbd>
                                  </>
                                ) : null}
                              </>
                            )}
                  </span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="secondary-btn"
            onClick={onReviewDue}
            disabled={overall.due === 0}
          >
            Review due
            <span className="btn-meta">
              {overall.due} waiting · <kbd>2</kbd>
            </span>
          </button>
          <button
            type="button"
            className="ghost-btn study-path-ghost"
            onClick={onFreeLearn}
            disabled={overall.new === 0}
          >
            Free learn
            <span className="btn-meta">
              all new · no daily cap · {overall.new} left · <kbd>3</kbd>
            </span>
          </button>
        </div>

        <div className="stat-row" aria-label="Stats">
          <Stat label="Due" value={overall.due} />
          <Stat label="Seen" value={headStats.seen} />
          <Stat label="Strong" value={headStats.known} />
          <Stat label="Learning" value={headStats.learning} />
        </div>
        <p className="browse-hint muted-line">
          Or pick a lesson below to study one chapter.
        </p>
      </section>

      <section className="lessons-section">
        {BOOKS.map((book) => {
          const lessons = LESSONS.filter((l) => l.bookId === book.id)
          const bookStats = countHeadwordStats(
            progress,
            { kind: 'book', bookId: book.id },
            settings.direction,
          )
          const bookDone =
            bookStats.total > 0 && bookStats.seen >= bookStats.total
          return (
            <div key={book.id} className="book-block">
              <h2 className="book-heading">
                <span className="book-heading-title">{book.title}</span>
                {bookStats.total > 0 && (
                  <span
                    className={`book-heading-progress ${bookDone ? 'done' : ''}`}
                    title={`${bookStats.seen} of ${bookStats.total} flashcards seen`}
                  >
                    {bookDone && (
                      <span className="section-done-mark" aria-hidden>
                        ✓
                      </span>
                    )}
                    <span className="section-count">
                      {bookStats.seen}/{bookStats.total}
                    </span>
                  </span>
                )}
              </h2>
              <ul className="lesson-list">
                {lessons.map((lesson) => {
                  const head = countHeadwordStats(
                    progress,
                    {
                      kind: 'lesson',
                      bookId: book.id,
                      lessonId: lesson.id,
                    },
                    settings.direction,
                  )
                  const hasCards = head.total > 0
                  const done = hasCards && head.seen >= head.total
                  return (
                    <li key={`${book.id}-${lesson.id}`}>
                      <button
                        type="button"
                        className={`lesson-row ${hasCards ? '' : 'placeholder'} ${done ? 'done' : ''}`}
                        disabled={!hasCards}
                        onClick={() => {
                          if (!hasCards) return
                          onOpenLesson(book.id, lesson.id)
                        }}
                      >
                        <span className="lesson-id">{lesson.id}</span>
                        <span className="lesson-titles">
                          <span className="cy">{lesson.titleCy}</span>
                          <span className="en">{lesson.titleEn}</span>
                        </span>
                        <span
                          className={`lesson-counts ${done ? 'done' : ''}`}
                          title={
                            hasCards
                              ? `${head.seen} of ${head.total} flashcards seen`
                              : undefined
                          }
                        >
                          {hasCards ? (
                            <>
                              {done && (
                                <span className="section-done-mark" aria-hidden>
                                  ✓
                                </span>
                              )}
                              <em>{head.seen}</em>/{head.total}
                            </>
                          ) : (
                            <span className="soon">Soon</span>
                          )}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function LessonView({
  bookId,
  lessonId,
  progress,
  direction,
  apiKey,
  listenActivities,
  onLearn,
  onReview,
  onActivity,
  onOpenGuide,
}: {
  bookId: BookId
  lessonId: LessonId
  progress: ProgressMap
  direction: DirectionMode
  apiKey: string
  listenActivities: boolean
  onLearn: () => void
  onReview: () => void
  onActivity: (activity: ActivityKind) => void
  onOpenGuide?: () => void
}) {
  const lesson = getLesson(bookId, lessonId)!
  const filter = { kind: 'lesson' as const, bookId, lessonId }
  const stats = countStats(progress, filter, direction)
  const cards = cardsForLesson(bookId, lessonId)
  const empty = cards.length === 0
  const seen = getSeenVocab(progress, filter, direction)
  const gendered = getSeenGenderedVocab(progress, filter, direction)
  const plurals = seen.filter((c) => Boolean(c.plural))
  const seenCount = seen.length

  const [searchTokens, setSearchTokens] = useState<string[]>([])
  const [posFilter, setPosFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [strengthFilter, setStrengthFilter] = useState<string[]>([])
  const [sortMode, setSortMode] = useState<VocabSortMode>('number')
  const [shuffleSeed, setShuffleSeed] = useState(0)

  const posOptions = useMemo(() => {
    const set = new Set<string>()
    for (const c of cards) {
      for (const p of formatPosList(c.pos)) set.add(p)
    }
    return [...set].sort().map((p) => ({ value: p, label: p }))
  }, [cards])

  const filteredCards = useMemo(() => {
    const matched = cards.filter((c) => {
      const hay = [
        c.welsh,
        c.english,
        c.plural ?? '',
        c.sense ?? '',
        c.notes ?? '',
      ].join(' ')
      if (!matchesSearchTokens(hay, searchTokens)) return false
      if (
        posFilter.length > 0 &&
        !formatPosList(c.pos).some((p) => posFilter.includes(p))
      ) {
        return false
      }
      const status = vocabStudyStatus(progress, c.id, direction)
      if (statusFilter.length > 0 && !statusFilter.includes(status)) {
        return false
      }
      const score = strengthForVocab(progress, c.id, direction)
      if (
        strengthFilter.length > 0 &&
        !strengthFilter.includes(strengthLabel(score))
      ) {
        return false
      }
      return true
    })

    if (sortMode === 'number') {
      return [...matched].sort((a, b) => a.number - b.number)
    }
    if (sortMode === 'easy-hard' || sortMode === 'hard-easy') {
      const dir = sortMode === 'easy-hard' ? 1 : -1
      return [...matched].sort((a, b) => {
        const sa = strengthForVocab(progress, a.id, direction)
        const sb = strengthForVocab(progress, b.id, direction)
        if (sa !== sb) return (sa - sb) * dir
        return a.number - b.number
      })
    }
    // random — stable for this shuffleSeed
    void shuffleSeed
    const a = [...matched]
    // Seeded-ish shuffle from seed + ids so React re-renders stay stable
    let s = (shuffleSeed + 1) * 2654435761
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) >>> 0
      const j = s % (i + 1)
      ;[a[i], a[j]] = [a[j]!, a[i]!]
    }
    return a
  }, [
    cards,
    searchTokens,
    posFilter,
    statusFilter,
    strengthFilter,
    progress,
    direction,
    sortMode,
    shuffleSeed,
  ])

  useKeydown(
    (e) => {
      if (empty) return
      if (e.key === 'l' || e.key === 'L') {
        if (stats.new === 0 && stats.learning === 0) return
        e.preventDefault()
        onLearn()
      } else if (e.key === 'r' || e.key === 'R') {
        if (stats.due === 0 && stats.new === 0) return
        e.preventDefault()
        onReview()
      } else if (e.key === '1' && gendered.length >= 1) {
        e.preventDefault()
        onActivity('gender')
      } else if (e.key === '2' && seenCount >= 4) {
        e.preventDefault()
        onActivity('match')
      } else if (e.key === '3' && listenActivities && seenCount >= 4) {
        e.preventDefault()
        onActivity('listen')
      } else if (e.key === '4' && plurals.length >= 2) {
        e.preventDefault()
        onActivity('plurals')
      }
    },
    [
      empty,
      stats,
      gendered.length,
      seenCount,
      plurals.length,
      listenActivities,
      onLearn,
      onReview,
      onActivity,
    ],
  )

  return (
    <div className="lesson-page layout-split">
      <div>
        <p className="book-kicker">{getBook(bookId).title}</p>
        <h1 className="page-title">
          <span className="lesson-id-lg">{lesson.id}</span> {lesson.titleCy}
        </h1>
        <p className="page-lead">{lesson.titleEn}</p>
        {empty ? (
          <p className="placeholder-note">
            No cards yet — paste chapter text in chat to fill this section.
          </p>
        ) : (
          <>
            <div className="action-grid">
              {onOpenGuide && !empty && (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={onOpenGuide}
                >
                  Learn grammar
                  <span className="btn-meta">
                    Phrases, grammar, and culture
                  </span>
                </button>
              )}
              <button
                type="button"
                className="primary-btn"
                onClick={onLearn}
                disabled={stats.new === 0 && stats.learning === 0}
              >
                Learn
                <span className="btn-meta">
                  {stats.new} new
                  {stats.learning > 0 ? ` · ${stats.learning} steps` : ''}
                  {' · '}
                  <kbd>L</kbd>
                </span>
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={onReview}
                disabled={stats.due === 0 && stats.new === 0}
              >
                Review
                <span className="btn-meta">
                  {stats.due} due · <kbd>R</kbd>
                </span>
              </button>
            </div>
            <div className="stat-row compact">
              <Stat label="Due" value={stats.due} />
              <Stat label="Learning" value={stats.learning} />
              <Stat label="New" value={stats.new} />
            </div>

            <section className="practice-section">
              <h2 className="practice-heading">Practice</h2>
              <p className="practice-lead">
                Extra drills for cards you’ve already seen
                {seenCount > 0 ? ` · ${seenCount} ready` : ''}
                {' · '}
                <kbd>1</kbd>–<kbd>4</kbd>
              </p>
              <div className="practice-grid">
                <button
                  type="button"
                  className="practice-card"
                  disabled={gendered.length < 1}
                  onClick={() => onActivity('gender')}
                >
                  <span className="practice-title">Gender <kbd>1</kbd></span>
                  <span className="practice-desc">Pick m or f</span>
                </button>
                <button
                  type="button"
                  className="practice-card"
                  disabled={seenCount < 4}
                  onClick={() => onActivity('match')}
                >
                  <span className="practice-title">Match <kbd>2</kbd></span>
                  <span className="practice-desc">Welsh ↔ English</span>
                </button>
                <button
                  type="button"
                  className="practice-card"
                  disabled={!listenActivities || seenCount < 4}
                  onClick={() => onActivity('listen')}
                  title={
                    listenActivities
                      ? undefined
                      : 'Enable Listening activities in Settings'
                  }
                >
                  <span className="practice-title">Listen <kbd>3</kbd></span>
                  <span className="practice-desc">
                    {listenActivities ? 'Hear → 4 choices' : 'Audio off'}
                  </span>
                </button>
                <button
                  type="button"
                  className="practice-card"
                  disabled={plurals.length < 2}
                  onClick={() => onActivity('plurals')}
                >
                  <span className="practice-title">Plurals <kbd>4</kbd></span>
                  <span className="practice-desc">Singular → plural</span>
                </button>
              </div>
            </section>
          </>
        )}
      </div>
      <section className="preview-section">
        {empty ? (
          <div className="placeholder-panel">
            <p>Temporary chapter slot</p>
            <p className="muted-line">{getBook(bookId).title}</p>
          </div>
        ) : (
          <>
            <VocabBrowseControls
              searchTokens={searchTokens}
              onSearchTokens={setSearchTokens}
              posOptions={posOptions}
              posValues={posFilter}
              onPos={setPosFilter}
              statusValues={statusFilter}
              onStatus={setStatusFilter}
              strengthValues={strengthFilter}
              onStrength={setStrengthFilter}
              sortMode={sortMode}
              onSortMode={(mode) => {
                setSortMode(mode)
                if (mode === 'random') setShuffleSeed((n) => n + 1)
              }}
              onReshuffle={() => setShuffleSeed((n) => n + 1)}
              resultCount={filteredCards.length}
              totalCount={cards.length}
            />
            <ul className="term-preview">
              {filteredCards.length === 0 ? (
                <li className="term-empty">No terms match these filters.</li>
              ) : (
                filteredCards.map((c) => {
                  const score = strengthForVocab(progress, c.id, direction)
                  const pct = Math.round(score * 100)
                  const status = vocabStudyStatus(progress, c.id, direction)
                  return (
                    <li key={c.id}>
                      <span className="term-num">{c.number}.</span>
                      <span className="term-word">
                        <SpeakButton text={c.welsh} apiKeyStored={apiKey} />
                        <span className="w">
                          {c.welsh}
                          {showsGender(c) && c.gender && (
                            <span className="gender" data-gender={c.gender}>
                              {c.gender}
                            </span>
                          )}
                        </span>
                        {formatPosList(c.pos).length > 0 && (
                          <span className="term-pos-row">
                            {formatPosList(c.pos).map((label) => (
                              <span key={label} className="pos-chip">
                                {label}
                              </span>
                            ))}
                          </span>
                        )}
                        {c.plural && (
                          <span className="term-plural">
                            <span className="term-plural-label">pl.</span>
                            {c.plural}
                          </span>
                        )}
                      </span>
                      <span className="e">
                        {c.english}
                        {c.sense && (
                          <span className="sense"> · {c.sense}</span>
                        )}
                      </span>
                      {c.dialect === 'N' || c.dialect === 'S' ? (
                        <span className="dialect" data-dialect={c.dialect}>
                          {dialectLabel(c.dialect)}
                        </span>
                      ) : (
                        <span className="dialect-slot" aria-hidden />
                      )}
                      <span
                        className="status-chip"
                        data-status={status}
                        title={vocabStatusLabel(status)}
                      >
                        {vocabStatusLabel(status)}
                      </span>
                      <span
                        className="term-mastery"
                        title={strengthLabel(score)}
                        aria-label={`Mastery ${strengthLabel(score)}`}
                      >
                        <span className="term-mastery-track">
                          <span
                            className="term-mastery-fill"
                            style={{ width: `${pct}%` }}
                            data-level={
                              pct === 0
                                ? 'new'
                                : pct < 35
                                  ? 'learning'
                                  : pct < 55
                                    ? 'young'
                                    : pct < 75
                                      ? 'good'
                                      : 'strong'
                            }
                          />
                        </span>
                      </span>
                    </li>
                  )
                })
              )}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}

function StudyView({
  mode,
  filter,
  quotaCardIds,
  sessionReviewMax,
  segmentLabel,
  progress,
  settings,
  onProgress,
  onAsk,
  onExit,
}: {
  mode: 'learn' | 'review'
  filter: SessionFilter
  /** When set, Learn only introduces these headwords (daily goal pool). */
  quotaCardIds?: string[]
  /** Absolute review max watermark for this Learn segment. */
  sessionReviewMax?: number
  segmentLabel?: string
  progress: ProgressMap
  settings: AppSettings
  onProgress: (p: ProgressMap) => void
  onAsk: (context?: string) => void
  onExit: () => void
}) {
  const isQuota = mode === 'learn' && quotaCardIds !== undefined
  const allowIds = isQuota ? quotaCardIds : undefined
  const reviewMax = sessionReviewMax ?? settings.maxDailyReviews

  const seedWave = () =>
    mode === 'learn'
      ? advanceLearnWave(
          progress,
          filter,
          settings.direction,
          [],
          settings.learnBatchSize,
          { allowCardIds: allowIds },
        )
      : []

  const [waveIds, setWaveIds] = useState<string[]>(seedWave)
  const [queue, setQueue] = useState<StudyItem[]>(() =>
    buildQueue(
      progress,
      mode,
      filter,
      settings.direction,
      new Date(),
      undefined,
      settings.learnBatchSize,
      seedWave(),
      allowIds,
      reviewMax,
    ),
  )
  const [history, setHistory] = useState<StudyItem[]>([])
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)
  const [reviewed, setReviewed] = useState(0)
  const [cardHovered, setCardHovered] = useState(false)
  const [sessionOpen, setSessionOpen] = useState(false)
  const [waitUntil, setWaitUntil] = useState<Date | null>(null)
  const [nowTick, setNowTick] = useState(() => Date.now())
  /** Bumps so a stale “wait” timer can’t wipe a fresh learn batch. */
  const queueEpoch = useRef(0)
  const cardsSinceActivity = useRef(0)
  const lastActivityKind = useRef<ActivityKind | null>(null)
  const [activityBreak, setActivityBreak] = useState<{
    kind: ActivityKind
    cards: VocabCard[]
  } | null>(null)
  const [sessionLog, setSessionLog] = useState<
    {
      progressId: string
      item: StudyItem
      lastRating: Grade
      ratings: Grade[]
    }[]
  >([])
  const [, setDailyTick] = useState(0)
  const sessionStartedAt = useRef(Date.now())
  const [elapsedNow, setElapsedNow] = useState(() => Date.now())
  const sessionIntroduced = useRef(0)

  useEffect(() => {
    if (activityBreak) return
    const id = window.setInterval(() => setElapsedNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [activityBreak])

  const current = queue[0]
  const learningLeft = getLearningItems(
    progress,
    filter,
    settings.direction,
    allowIds,
  ).length
  const newLeft = countNewItems(
    progress,
    filter,
    settings.direction,
    allowIds,
  )
  const todaysIntro = dailyIntroCount()
  const goalRemaining = remainingDailyGoal(settings.dailyWordGoal)
  const canLearnMore = mode === 'learn' && newLeft > 0

  const intervals = useMemo(() => {
    if (!current || !flipped) return null
    return previewIntervals(progress, current.progressId)
  }, [current, flipped, progress])

  /** Always open the next brand-new batch (ignores sticky wave / wait). */
  function openNextLearnBatch(nextProgress: ProgressMap): boolean {
    if (mode !== 'learn') return false
    const forced = advanceLearnWave(
      nextProgress,
      filter,
      settings.direction,
      [],
      settings.learnBatchSize,
      { forceNew: true, allowCardIds: allowIds },
    )
    if (forced.length === 0) return false
    const resumed = buildQueue(
      nextProgress,
      'learn',
      filter,
      settings.direction,
      new Date(),
      undefined,
      settings.learnBatchSize,
      forced,
      allowIds,
      reviewMax,
    )
    if (resumed.length === 0) return false
    queueEpoch.current += 1
    setWaveIds(forced)
    setQueue(resumed)
    setWaitUntil(null)
    setDone(false)
    setFlipped(false)
    return true
  }

  function refreshQueue(
    nextProgress: ProgressMap,
    justSeenId?: string,
    wave = waveIds,
    forceNew = false,
  ) {
    if (forceNew && mode === 'learn') {
      if (openNextLearnBatch(nextProgress)) return
    }

    let nextWave =
      mode === 'learn'
        ? advanceLearnWave(
            nextProgress,
            filter,
            settings.direction,
            wave,
            settings.learnBatchSize,
            { allowCardIds: allowIds },
          )
        : wave

    if (mode === 'learn' && nextWave.length === 0) {
      if (openNextLearnBatch(nextProgress)) return
    }

    if (mode === 'learn') setWaveIds(nextWave)

    const nextQueue = buildQueue(
      nextProgress,
      mode,
      filter,
      settings.direction,
      new Date(),
      justSeenId,
      settings.learnBatchSize,
      nextWave,
      allowIds,
      reviewMax,
    )
    setQueue(nextQueue)
    setFlipped(false)

    if (nextQueue.length > 0) {
      queueEpoch.current += 1
      setWaitUntil(null)
      setDone(false)
      return
    }

    // Still learning cards due soon — wait rather than dumping another new wave.
    const nextDue = nextLearningDueAt(
      nextProgress,
      filter,
      settings.direction,
      allowIds,
    )

    if (nextDue && nextDue.getTime() > Date.now()) {
      setWaitUntil(nextDue)
      setDone(false)
      return
    }

    // Nothing due and no news in this wave — open the next set only if ready.
    if (mode === 'learn' && openNextLearnBatch(nextProgress)) return

    setWaitUntil(null)
    setDone(true)
  }

  // If Learn opens with an empty queue, recover instead of "Nothing due".
  useEffect(() => {
    if (mode !== 'learn') return
    if (queue.length > 0 || done || waitUntil) return
    refreshQueue(progress, undefined, waveIds, true)
    // intentionally once on mount / empty recover
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!waitUntil || current) return
    // Don't auto-dump more new words while waiting on learning steps —
    // let the timer fire, or the user can tap “Learn more new”.
    const epoch = queueEpoch.current
    const ms = Math.max(250, waitUntil.getTime() - Date.now())
    const id = window.setTimeout(() => {
      if (epoch !== queueEpoch.current) return
      setNowTick(Date.now())
      refreshQueue(progress)
    }, Math.min(ms, 15_000))
    const tick = window.setInterval(() => setNowTick(Date.now()), 1000)
    return () => {
      window.clearTimeout(id)
      window.clearInterval(tick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitUntil, current, progress])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return

      if (e.key === 'Escape') {
        e.preventDefault()
        onExit()
        return
      }

      if (
        (e.key === '`' || e.key === '~') &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        if (history.length === 0) return
        e.preventDefault()
        goBack()
        return
      }

      if (
        (e.key === 'Backspace' || e.key === 'ArrowLeft') &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        if (history.length === 0) return
        e.preventDefault()
        goBack()
        return
      }

      if (!current || done) return

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        e.stopPropagation()
        setFlipped((f) => !f)
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        setFlipped((f) => !f)
        return
      }

      if (
        (e.key === 'r' || e.key === 'R') &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        e.preventDefault()
        void playAudio()
        return
      }

      if (!flipped) return

      const map: Record<string, Grade> = {
        '1': Rating.Again,
        '2': Rating.Hard,
        '3': Rating.Good,
        '4': Rating.Easy,
      }
      const rating = map[e.key]
      if (rating) {
        e.preventDefault()
        rate(rating)
      }
    }
    if (activityBreak) return
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  })

  async function playAudio() {
    if (!current) return
    try {
      await speakWelsh({
        text: welshTextFor(current),
        apiKey: getApiKey(settings.apiKey),
      })
    } catch {
      /* ignore */
    }
  }

  function goBack() {
    setHistory((h) => {
      if (h.length === 0) return h
      const prev = h[h.length - 1]!
      setQueue((q) => [
        prev,
        ...q.filter((i) => i.progressId !== prev.progressId),
      ])
      setFlipped(true)
      setDone(false)
      setWaitUntil(null)
      return h.slice(0, -1)
    })
  }

  function rate(rating: Grade) {
    if (!current) return
    const rated = current
    const wasNew = isNew(progress[rated.progressId])
    if (isFirstVocabIntroduction(progress, rated, settings.direction)) {
      recordDailyIntroduced(rated.card.id)
      sessionIntroduced.current += 1
      setDailyTick((n) => n + 1)
    }
    if (!wasNew) {
      recordDailyReview()
      setDailyTick((n) => n + 1)
    }
    const nextProgress = applyRating(progress, rated.progressId, rating)
    onProgress(nextProgress)
    setReviewed((n) => n + 1)
    setHistory((h) => [...h, rated])

    setSessionLog((log) => {
      const existing = log.find((row) => row.progressId === rated.progressId)
      if (existing) {
        return log.map((row) =>
          row.progressId === rated.progressId
            ? {
                ...row,
                lastRating: rating,
                ratings: [...row.ratings, rating],
              }
            : row,
        )
      }
      return [
        ...log,
        {
          progressId: rated.progressId,
          item: rated,
          lastRating: rating,
          ratings: [rating],
        },
      ]
    })

    // Rare, short practice breaks — keep daily goal near ~30 minutes.
    if (settings.learnActivities && mode === 'learn') {
      cardsSinceActivity.current += 1
      if (cardsSinceActivity.current >= 24) {
        const preferIds = [
          ...new Set(
            [...sessionLog.map((r) => r.item.card.id), rated.card.id].reverse(),
          ),
        ].slice(0, 24)
        const pick = pickLearnActivity(nextProgress, settings.direction, {
          preferIds,
          filter,
          avoidKind: lastActivityKind.current ?? undefined,
          allowListen: settings.listenActivities,
        })
        if (pick) {
          cardsSinceActivity.current = 0
          lastActivityKind.current = pick.kind
          setFlipped(false)
          setActivityBreak(pick)
          refreshQueue(nextProgress, rated.progressId)
          return
        }
      }
    }

    refreshQueue(nextProgress, rated.progressId)
  }

  if (activityBreak) {
    return (
      <StudyActivityBreak
        activity={activityBreak.kind}
        cards={activityBreak.cards}
        apiKey={settings.apiKey}
        canBack={history.length > 0}
        onDone={() => setActivityBreak(null)}
        onSkip={() => setActivityBreak(null)}
        onBack={() => {
          setActivityBreak(null)
          goBack()
        }}
      />
    )
  }

  if (!current && waitUntil) {
    const remainMs = Math.max(0, waitUntil.getTime() - nowTick)
    const remainLabel = formatInterval(
      new Date(Date.now() + remainMs),
      new Date(),
    )
    return (
      <div className="study-empty">
        <p>Next review in {remainLabel}</p>
        <p className="muted-line">
          {learningLeft} card{learningLeft === 1 ? '' : 's'} in learning steps
          {newLeft > 0 ? ` · ${newLeft} new ready` : ''}
          {isQuota ? ` · goal ${todaysIntro}/${settings.dailyWordGoal}` : ''}
        </p>
        <div className="action-grid" style={{ maxWidth: 280, margin: '0 auto' }}>
          {canLearnMore && (
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                if (!openNextLearnBatch(progress)) {
                  setWaitUntil(null)
                  setDone(true)
                }
              }}
            >
              Learn more new
            </button>
          )}
          <button type="button" className="ghost-btn" onClick={onExit}>
            {filter.kind === 'all' ? 'Back home' : 'Back to lesson'}
          </button>
        </div>
      </div>
    )
  }

  if (!current && !done) {
    return (
      <div className="study-empty">
        <p>
          {mode === 'learn'
            ? isQuota && goalRemaining <= 0
              ? 'Today’s word goal is done.'
              : isQuota && newLeft === 0
                ? 'Today’s quota is finished.'
                : 'No new cards left in this chapter.'
            : 'Nothing due.'}
        </p>
        {mode === 'learn' && learningLeft > 0 ? (
          <>
            <p className="muted-line">
              {learningLeft} still in learning steps — come back shortly, or
              review from home.
            </p>
            <button type="button" className="primary-btn" onClick={onExit}>
              {filter.kind === 'all' ? 'Back home' : 'Back to lesson'}
            </button>
          </>
        ) : (
          <button type="button" className="primary-btn" onClick={onExit}>
            Done
          </button>
        )}
      </div>
    )
  }

  if (done) {
    return (
      <div className="study-empty">
        <p>{reviewed} done</p>
        {isQuota && (
          <p className="muted-line">
            Today {todaysIntro}/{settings.dailyWordGoal} new words
          </p>
        )}
        <div className="action-grid" style={{ maxWidth: 280, margin: '0 auto' }}>
          {canLearnMore && (
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                setDone(false)
                openNextLearnBatch(progress)
              }}
            >
              Learn more new
            </button>
          )}
          {history.length > 0 && (
            <button type="button" className="secondary-btn" onClick={goBack}>
              ← Back
            </button>
          )}
          <button type="button" className="ghost-btn" onClick={onExit}>
            {filter.kind === 'all' ? 'Back home' : 'Back to lesson'}
          </button>
        </div>
      </div>
    )
  }

  const front = promptFor(current)
  const back = answerFor(current)
  const sense = senseFor(current)
  const lesson = getLesson(current.card.bookId, current.card.lessonId)
  const frontIsWelsh = current.direction === 'cy-en'
  const posLabels = formatPosList(current.card.pos)
  const revealGender = showsGender(current.card)
  const context = `#${current.card.number} ${current.card.welsh}${
    revealGender && current.card.gender ? ` (${current.card.gender})` : ''
  }${posLabels.length ? ` · ${posLabels.join(', ')}` : ''} — ${current.card.english}${
    sense ? ` [${sense}]` : ''
  }${current.card.notes ? `\n${current.card.notes}` : ''}`

  const scopeLabel =
    isQuota
      ? segmentLabel
        ? `goal · ${segmentLabel}`
        : 'today’s goal'
      : filter.kind === 'lesson'
        ? filter.lessonId
        : filter.kind === 'book'
          ? getBook(filter.bookId).short
          : 'all'

  const sessionElapsed = formatElapsed(elapsedNow - sessionStartedAt.current)
  const isNewCard =
    !!current &&
    isFirstVocabIntroduction(progress, current, settings.direction)
  const reviewsDoneToday = dailyReviewCount()
  const reviewCapToday = Math.max(reviewMax, 1)
  const reviewsLeftToday = remainingDailyReviews(reviewMax)
  const reviewsPct = Math.min(
    100,
    Math.round((reviewsDoneToday / reviewCapToday) * 100),
  )
  const wordsPct = Math.min(
    100,
    Math.round((todaysIntro / Math.max(settings.dailyWordGoal, 1)) * 100),
  )
  const showWordsBar = mode === 'learn' || isQuota

  return (
    <div className="study">
      <div className="study-top">
        <button
          type="button"
          className="study-back-btn"
          onClick={goBack}
          disabled={history.length === 0}
            title="Previous card (~ / ← / Backspace)"
          >
            ← Back
          </button>
        <div className="study-meta">
          <span>
            {isQuota ? 'Daily goal' : mode === 'learn' ? 'Learn' : 'Review'} ·{' '}
            {scopeLabel} · {directionLabel(current.direction)}
            {mode === 'learn' && (
              <span className="study-wave">
                {' '}
                · set of {settings.learnBatchSize}
                {learningLeft > 0 ? ` · ${learningLeft} in steps` : ''}
              </span>
            )}
          </span>
          <span>
            {reviewed} rated · {queue.length} in queue · {sessionElapsed}
          </span>
        </div>
      </div>

      <div className="study-progress" aria-label="Session progress">
        {showWordsBar && (
          <div className="study-progress-row">
            <span className="study-progress-label">Words</span>
            <div
              className="study-progress-track"
              role="progressbar"
              aria-valuenow={todaysIntro}
              aria-valuemin={0}
              aria-valuemax={settings.dailyWordGoal}
            >
              <div
                className="study-progress-fill"
                style={{ width: `${wordsPct}%` }}
              />
            </div>
            <span className="study-progress-pct">
              {todaysIntro}/{settings.dailyWordGoal}
              {goalRemaining > 0 ? (
                <em className="study-progress-left"> · {goalRemaining} left</em>
              ) : (
                <em className="study-progress-left done"> · done</em>
              )}
            </span>
          </div>
        )}
        <div className="study-progress-row">
          <span className="study-progress-label">Reviews</span>
          <div
            className="study-progress-track"
            role="progressbar"
            aria-valuenow={reviewsDoneToday}
            aria-valuemin={0}
            aria-valuemax={reviewCapToday}
            aria-label={`${reviewsLeftToday} reviews left today`}
          >
            <div
              className="study-progress-fill reviews"
              style={{ width: `${reviewsPct}%` }}
            />
          </div>
          <span className="study-progress-pct">
            {reviewsDoneToday}/{reviewCapToday}
            {reviewsLeftToday > 0 ? (
              <em className="study-progress-left"> · {reviewsLeftToday} left</em>
            ) : (
              <em className="study-progress-left done"> · done</em>
            )}
          </span>
        </div>
        {mode === 'learn' && !isQuota && (
          <div className="study-progress-row">
            <span className="study-progress-label">Session</span>
            <div className="study-progress-plain">
              {sessionIntroduced.current} new · {learningLeft} in steps ·{' '}
              {sessionElapsed}
            </div>
          </div>
        )}
      </div>

      {sessionLog.length > 0 && (
        <details
          className="session-strip"
          open={sessionOpen}
          onToggle={(e) =>
            setSessionOpen((e.target as HTMLDetailsElement).open)
          }
        >
          <summary>
            This session · {sessionLog.length} card
            {sessionLog.length === 1 ? '' : 's'}
          </summary>
          <ul className="session-log">
            {[...sessionLog].reverse().map((row) => {
              const score = strengthForCard(progress[row.progressId])
              const pct = Math.round(score * 100)
              return (
                <li key={row.progressId}>
                  <span className="session-word">{row.item.card.welsh}</span>
                  <span className="session-en">{row.item.card.english}</span>
                  <span className="session-dir">
                    {directionLabel(row.item.direction)}
                  </span>
                  <span
                    className="term-mastery-track session-bar"
                    title={strengthLabel(score)}
                  >
                    <span
                      className="term-mastery-fill"
                      style={{ width: `${pct}%` }}
                      data-level={
                        pct === 0
                          ? 'new'
                          : pct < 35
                            ? 'learning'
                            : pct < 55
                              ? 'young'
                              : pct < 75
                                ? 'good'
                                : 'strong'
                      }
                    />
                  </span>
                  <span className="session-rating">
                    {
                      RATING_META.find((r) => r.rating === row.lastRating)
                        ?.label
                    }
                  </span>
                </li>
              )
            })}
          </ul>
        </details>
      )}

      <article
        className={`flashcard ${flipped ? 'flipped' : ''} ${cardHovered ? 'hovered' : ''} ${isNewCard ? 'is-new' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
        role="button"
        tabIndex={0}
      >
        {isNewCard && (
          <span className="card-new-badge" aria-label="New word">
            New
          </span>
        )}
        <p className="card-lesson">
          <span className="card-num">#{current.card.number}</span>
          {lesson?.id}
          {dialectLabel(current.card.dialect) && (
            <span
              className="dialect-pill"
              data-dialect={current.card.dialect ?? undefined}
            >
              {dialectLabel(current.card.dialect)}
            </span>
          )}
        </p>
        <p className="card-side">{frontIsWelsh ? 'Welsh' : 'English'}</p>
        {frontIsWelsh ? (
          <div className="card-prompt-row">
            <SpeakButton
              text={welshTextFor(current)}
              apiKeyStored={settings.apiKey}
              stopPropagation
              className="card-speak"
            />
            <p className="card-prompt">{front}</p>
          </div>
        ) : (
          <p className="card-prompt">{front}</p>
        )}
        {frontIsWelsh && current.card.plural && (
          <p className="card-plural">
            <span className="card-plural-label">pl.</span> {current.card.plural}
          </p>
        )}
        {frontIsWelsh && sense && <p className="card-sense">{sense}</p>}
        {flipped ? (
          <div className="card-answer">
            <p className="card-side card-side-back">
              {current.direction === 'en-cy' ? 'Welsh' : 'English'}
            </p>
            {current.direction === 'en-cy' ? (
              <div className="card-back-row">
                <SpeakButton
                  text={welshTextFor(current)}
                  apiKeyStored={settings.apiKey}
                  stopPropagation
                  className="card-speak"
                />
                <p className="card-back">{back}</p>
              </div>
            ) : (
              <p className="card-back">{back}</p>
            )}
            {current.direction === 'en-cy' && current.card.plural && (
              <p className="card-plural">
                <span className="card-plural-label">pl.</span>{' '}
                {current.card.plural}
              </p>
            )}
            {!frontIsWelsh && sense && (
              <p className="card-sense">{sense}</p>
            )}
            {(posLabels.length > 0 || revealGender) && (
              <div className="card-meta-chips">
                {posLabels.map((label) => (
                  <span key={label} className="pos-chip">
                    {label}
                  </span>
                ))}
                {revealGender && current.card.gender && (
                  <span
                    className="gender-pill"
                    data-gender={current.card.gender}
                  >
                    {current.card.gender}
                  </span>
                )}
              </div>
            )}
            {current.card.notes && (
              <p className="card-notes">{current.card.notes}</p>
            )}
          </div>
        ) : null}
      </article>

      <div className="study-links">
        <SpeakButton
          text={welshTextFor(current)}
          apiKeyStored={settings.apiKey}
          label="Speak"
          className="text-speak"
        />
        <kbd className="inline-kbd">R</kbd>
        <span className="link-sep">·</span>
        <kbd className="inline-kbd">~</kbd>
        <span className="muted-inline"> back</span>
        <span className="link-sep">·</span>
        <button
          type="button"
          className="text-link"
          onClick={() => onAsk(context)}
        >
          Ask
        </button>
      </div>

      {flipped ? (
        <div className="ratings" role="group" aria-label="Rate">
          {RATING_META.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`rate-btn rate-${r.label.toLowerCase()}`}
              onClick={() => rate(r.rating)}
            >
              <kbd>{r.key}</kbd>
              <span className="rate-label">{r.label}</span>
              <span className="rate-interval">
                {intervals?.[r.rating] ?? '—'}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          className="reveal-btn"
          onClick={() => setFlipped(true)}
        >
          Show <kbd>Space</kbd>
        </button>
      )}
    </div>
  )
}
