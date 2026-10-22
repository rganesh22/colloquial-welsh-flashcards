import { useEffect, useState, type MouseEvent } from 'react'
import { getApiKey } from '../lib/gemini'
import {
  hasCachedTts,
  onTtsCached,
  speakWelsh,
} from '../lib/tts'

function SpeakerIcon({ ready }: { ready: boolean }) {
  return (
    <svg
      className="speaker-icon"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      fill={ready ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      {ready ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" fill="none" />
          <path d="M18 6a8 8 0 0 1 0 12" fill="none" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" opacity="0.45" />
          <path d="M18 6a8 8 0 0 1 0 12" opacity="0.3" />
        </>
      )}
    </svg>
  )
}

export function SpeakButton({
  text,
  apiKeyStored,
  className = '',
  stopPropagation = false,
  label,
}: {
  text: string
  apiKeyStored: string
  className?: string
  stopPropagation?: boolean
  label?: string
}) {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    setChecking(true)
    void hasCachedTts(text).then((hit) => {
      if (!cancelled) {
        setReady(hit)
        setChecking(false)
      }
    })
    const off = onTtsCached((cachedText) => {
      if (cachedText === text.trim()) setReady(true)
    })
    return () => {
      cancelled = true
      off()
    }
  }, [text])

  async function onClick(e: MouseEvent) {
    if (stopPropagation) e.stopPropagation()
    e.preventDefault()
    if (loading || !text.trim()) return
    setLoading(true)
    try {
      const res = await speakWelsh({
        text,
        apiKey: getApiKey(apiKeyStored),
      })
      if (res.source === 'gemini') setReady(true)
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false)
    }
  }

  const title = ready ? 'Play audio (saved)' : 'Play audio (will fetch)'

  return (
    <button
      type="button"
      className={`speak-btn ${ready ? 'ready' : 'pending'} ${loading ? 'loading' : ''} ${className}`}
      onClick={(e) => void onClick(e)}
      disabled={loading}
      title={title}
      aria-label={title}
      data-ready={ready ? '1' : '0'}
      data-checking={checking ? '1' : '0'}
    >
      <SpeakerIcon ready={ready} />
      {label !== undefined && <span className="speak-label">{label}</span>}
    </button>
  )
}
