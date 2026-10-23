import { useState } from 'react'
import type {
  ChapterGuide,
  GuideBlock,
  GuideLine,
  GuideStep,
} from '../lib/chapterGuide'
import type { LessonMeta } from '../lib/types'
import { getApiKey } from '../lib/gemini'
import { playWelshSequence } from '../lib/tts'
import { SpeakButton } from './SpeakButton'

const SECTION_ORDER = ['Phrase', 'Grammar', 'Pattern', 'Culture', 'Tip', 'Check']

const SECTION_TITLES: Record<string, string> = {
  Phrase: 'Phrases',
  Grammar: 'Grammar',
  Pattern: 'Patterns',
  Culture: 'Culture',
  Tip: 'Tips',
  Check: 'Check',
}

export function ChapterGuideView({
  lesson,
  guide,
  apiKey,
  onClose,
  onPractice,
}: {
  lesson: LessonMeta
  guide: ChapterGuide | null
  apiKey: string
  onClose: () => void
  onPractice: () => void
}) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const sections = guide ? groupSteps(guide.steps) : []

  async function playSection(id: string, lines: string[]) {
    setPlayingId(id)
    try {
      await playWelshSequence(lines, getApiKey(apiKey))
    } finally {
      setPlayingId((current) => (current === id ? null : current))
    }
  }

  return (
    <div className="guide-page chapter-reader">
      <div className="guide-top">
        <button type="button" className="ghost-btn" onClick={onClose}>
          Back
        </button>
      </div>
      <p className="book-kicker">Learn grammar</p>
      <h1 className="page-title">
        <span className="lesson-id-lg">{lesson.id}</span> {lesson.titleCy}
      </h1>
      <p className="page-lead">
        {guide?.intro ||
          'Phrases, grammar, and culture for this chapter. The word list stays in practice.'}
      </p>
      {sections.length === 0 ? (
        <p className="placeholder-note">
          This chapter’s grammar lesson is not written yet.
        </p>
      ) : (
        sections.map((section) => {
          const lines = section.steps.flatMap(welshLines)
          return (
            <section key={section.kicker} className="learn-section">
              <div className="learn-section-head">
                <h2>{section.title}</h2>
                {lines.length > 0 && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => void playSection(section.kicker, lines)}
                  >
                    {playingId === section.kicker ? 'Playing…' : 'Play section'}
                  </button>
                )}
              </div>
              {section.steps.map((step) => (
                <article key={step.id} className="chapter-pattern">
                  <h3>{step.title}</h3>
                  <div className="guide-blocks">
                    {step.blocks.map((block, i) => (
                      <GuideBlockView
                        key={`${step.id}-${i}`}
                        block={block}
                        apiKey={apiKey}
                      />
                    ))}
                  </div>
                </article>
              ))}
            </section>
          )
        })
      )}
      <div className="guide-nav">
        <button type="button" className="primary-btn" onClick={onPractice}>
          Practice the words
        </button>
      </div>
    </div>
  )
}

function groupSteps(steps: GuideStep[]): {
  kicker: string
  title: string
  steps: GuideStep[]
}[] {
  const buckets = new Map<string, GuideStep[]>()
  for (const step of steps) {
    const key = step.kicker || 'Grammar'
    const list = buckets.get(key) ?? []
    list.push(step)
    buckets.set(key, list)
  }
  const ordered = [
    ...SECTION_ORDER.filter((kicker) => buckets.has(kicker)),
    ...[...buckets.keys()].filter((kicker) => !SECTION_ORDER.includes(kicker)),
  ]
  return ordered.map((kicker) => ({
    kicker,
    title: SECTION_TITLES[kicker] ?? kicker,
    steps: buckets.get(kicker) ?? [],
  }))
}

function welshLines(step: GuideStep): string[] {
  const lines: string[] = []
  for (const block of step.blocks) {
    if (block.type === 'say') lines.push(block.line.welsh)
    if (block.type === 'rule') {
      for (const example of block.examples) lines.push(example.welsh)
    }
  }
  return lines.filter((line) => line.trim())
}

function Line({ line, apiKey }: { line: GuideLine; apiKey: string }) {
  return (
    <div className="guide-line chapter-line">
      <SpeakButton text={line.welsh} apiKeyStored={apiKey} className="card-speak" />
      <div>
        <p className="guide-welsh">{line.welsh}</p>
        <p className="guide-english">{line.english}</p>
        {line.note && <p className="guide-note">{line.note}</p>}
      </div>
    </div>
  )
}

function GuideBlockView({
  block,
  apiKey,
}: {
  block: GuideBlock
  apiKey: string
}) {
  if (block.type === 'say') return <Line line={block.line} apiKey={apiKey} />
  if (block.type === 'rule') {
    return (
      <section className="guide-rule">
        <h2>{block.title}</h2>
        <p>{block.body}</p>
        <div className="guide-examples">
          {block.examples.map((line) => (
            <Line key={line.welsh} line={line} apiKey={apiKey} />
          ))}
        </div>
      </section>
    )
  }
  if (block.type === 'culture') {
    return (
      <section className="guide-culture">
        <h2>{block.title}</h2>
        <p>{block.body}</p>
      </section>
    )
  }
  if (block.type === 'tip') return <p className="guide-tip">{block.body}</p>
  return <CheckBlock block={block} />
}

function CheckBlock({
  block,
}: {
  block: Extract<GuideBlock, { type: 'check' }>
}) {
  const [picked, setPicked] = useState<string | null>(null)
  const options = block.options ?? []
  const correct =
    picked === block.answer || (options.length === 0 && picked != null)
  return (
    <section className="guide-check">
      <p className="guide-check-prompt">{block.prompt}</p>
      {options.length > 0 ? (
        <div className="guide-options">
          {options.map((option) => {
            const state =
              picked == null
                ? ''
                : option === block.answer
                  ? 'is-right'
                  : option === picked
                    ? 'is-wrong'
                    : ''
            return (
              <button
                key={option}
                type="button"
                className={`guide-option ${state}`}
                disabled={picked != null}
                onClick={() => setPicked(option)}
              >
                {option}
              </button>
            )
          })}
        </div>
      ) : (
        <button
          type="button"
          className="secondary-btn"
          disabled={picked != null}
          onClick={() => setPicked(block.answer)}
        >
          Show answer
        </button>
      )}
      {picked != null && (
        <p className={correct ? 'guide-answer is-right' : 'guide-answer'}>
          {correct ? block.answer : `Answer: ${block.answer}`}
        </p>
      )}
    </section>
  )
}
