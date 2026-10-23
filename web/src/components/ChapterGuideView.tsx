import { useMemo, useState } from 'react'
import type { ChapterGuide, GuideBlock, GuideLine } from '../lib/chapterGuide'
import type { LessonMeta, VocabCard } from '../lib/types'
import { dialectLabel } from '../lib/srs'
import { getApiKey } from '../lib/gemini'
import { playWelshSequence } from '../lib/tts'
import { SpeakButton } from './SpeakButton'

export function ChapterGuideView({
  lesson,
  cards,
  guide,
  apiKey,
  onClose,
  onPractice,
}: {
  lesson: LessonMeta
  cards: VocabCard[]
  guide: ChapterGuide | null
  apiKey: string
  onClose: () => void
  onPractice: () => void
}) {
  const [query, setQuery] = useState('')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const needle = query.trim().toLowerCase()
  const visible = useMemo(() => {
    if (!needle) return cards
    return cards.filter((card) =>
      [card.welsh, card.english, card.notes, card.plural]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle),
    )
  }, [cards, needle])
  const sections = useMemo(() => groupCards(visible), [visible])

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
        <p className="guide-count">
          {visible.length} line{visible.length === 1 ? '' : 's'}
        </p>
      </div>
      <p className="book-kicker">{lesson.titleEn}</p>
      <h1 className="page-title">
        <span className="lesson-id-lg">{lesson.id}</span> {lesson.titleCy}
      </h1>
      <p className="page-lead">
        Every line from this chapter. Tap the speaker to hear it.
      </p>
      <input
        className="chapter-search"
        type="search"
        value={query}
        placeholder="Search this chapter"
        onChange={(e) => setQuery(e.target.value)}
      />
      {sections.length === 0 ? (
        <p className="placeholder-note">Nothing in this chapter matches.</p>
      ) : (
        sections.map((section) => (
          <section key={section.id} className="chapter-section">
            <div className="chapter-section-head">
              <h2>{section.title}</h2>
              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  void playSection(
                    section.id,
                    section.cards.map((card) => card.welsh),
                  )
                }
              >
                {playingId === section.id ? 'Playing…' : 'Play section'}
              </button>
            </div>
            <ul className="chapter-lines">
              {section.cards.map((card) => (
                <li key={card.id} className="chapter-line">
                  <SpeakButton
                    text={card.welsh}
                    apiKeyStored={apiKey}
                    className="card-speak"
                  />
                  <div>
                    <p className="guide-welsh">{card.welsh}</p>
                    <p className="guide-english">{card.english}</p>
                    {metaLine(card) && (
                      <p className="chapter-meta">{metaLine(card)}</p>
                    )}
                    {card.notes && <p className="guide-note">{card.notes}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
      {guide && guide.steps.length > 0 && (
        <section className="chapter-patterns">
          <h2>Patterns in this chapter</h2>
          {guide.intro && <p className="guide-intro">{guide.intro}</p>}
          {guide.steps.map((step) => (
            <article key={step.id} className="chapter-pattern">
              <p className="guide-kicker">{step.kicker}</p>
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
      )}
      <div className="guide-nav">
        <button type="button" className="primary-btn" onClick={onPractice}>
          Practice this chapter
        </button>
      </div>
    </div>
  )
}

const GRAMMAR_TAGS = new Set([
  'noun',
  'verb',
  'verb-noun',
  'adj',
  'adjective',
  'adv',
  'adverb',
  'name',
  'prep',
  'preposition',
  'pron',
  'pronoun',
  'conj',
  'conjunction',
  'phrase',
  'particle',
  'poss',
  'possessive',
  'article',
  'num',
  'numeral',
])

const SECTION_LABELS: Record<string, string> = {
  sgwrs: 'Dialogue',
  geirfa: 'Vocabulary',
  vowel: 'Vowels',
  consonant: 'Consonants',
  diphthong: 'Diphthongs',
}

function topicTag(card: VocabCard): string | undefined {
  const tags = card.tags ?? []
  return tags.find((tag) => !GRAMMAR_TAGS.has(tag)) ?? tags[0]
}

function groupCards(cards: VocabCard[]): {
  id: string
  title: string
  cards: VocabCard[]
}[] {
  const sections: { id: string; title: string; cards: VocabCard[] }[] = []
  for (const card of cards) {
    const title = sectionTitle(topicTag(card))
    const last = sections[sections.length - 1]
    if (last && last.title === title) last.cards.push(card)
    else sections.push({ id: `${title}-${card.id}`, title, cards: [card] })
  }
  return sections
}

function metaLine(card: VocabCard): string {
  const bits: string[] = []
  const dialect = dialectLabel(card.dialect)
  if (dialect) bits.push(dialect)
  if (card.gender === 'm') bits.push('masculine')
  else if (card.gender === 'f') bits.push('feminine')
  if (card.plural) bits.push(`plural ${card.plural}`)
  return bits.join(' · ')
}

function sectionTitle(tag: string | undefined): string {
  if (!tag) return 'Words'
  const known = SECTION_LABELS[tag]
  if (known) return known
  return tag
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
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
