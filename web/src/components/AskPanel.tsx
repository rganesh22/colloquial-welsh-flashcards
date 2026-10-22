import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import {
  ASK_MODELS,
  askGeminiChat,
  clampAskModel,
  clampAskTemperature,
  getApiKey,
  type ChatTurn,
} from '../lib/gemini'
import { MarkdownBody } from './MarkdownBody'

type UiMessage = ChatTurn & {
  id: string
  cached?: boolean
  pending?: boolean
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function AskPanel({
  apiKeyStored,
  context,
  open,
  onClose,
  onOpen,
  model,
  temperature,
  onSettings,
}: {
  apiKeyStored: string
  context?: string
  open: boolean
  onClose: () => void
  onOpen: () => void
  model: string
  temperature: number
  onSettings: (p: {
    askModel?: string
    askTemperature?: number
  }) => void
}) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<UiMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, loading, open])

  async function send(text: string) {
    const q = text.trim()
    if (!q || loading) return
    const key = getApiKey(apiKeyStored)
    if (!key) {
      setError('Add a Gemini API key in Settings.')
      return
    }

    const history: ChatTurn[] = messages
      .filter((m) => !m.pending)
      .map(({ role, text: t }) => ({ role, text: t }))

    const userMsg: UiMessage = { id: newId(), role: 'user', text: q }
    setMessages((m) => [...m, userMsg])
    setQuestion('')
    setLoading(true)
    setError(null)

    try {
      const res = await askGeminiChat({
        apiKey: key,
        model,
        temperature,
        question: q,
        context,
        history,
      })
      setMessages((m) => [
        ...m,
        {
          id: newId(),
          role: 'model',
          text: res.text,
          cached: res.cached,
        },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ask failed')
      // Keep the user message so they can retry / edit.
    } finally {
      setLoading(false)
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    void send(question)
  }

  function onInputKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send(question)
    }
  }

  function clearChat() {
    setMessages([])
    setError(null)
  }

  if (!open) {
    return (
      <button
        type="button"
        className="ask-fab"
        onClick={onOpen}
        aria-label="Open Ask chat"
        title="Ask"
      >
        Ask
      </button>
    )
  }

  return (
    <div
      className="ask-dock"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
    >
      <header className="ask-dock-head">
        <div className="ask-dock-titles">
          <h2 id={titleId}>Ask</h2>
          <span className="ask-dock-model">
            {ASK_MODELS.find((m) => m.id === model)?.label ?? model}
          </span>
        </div>
        <div className="ask-dock-actions">
          <button
            type="button"
            className={`icon-btn ${showConfig ? 'on' : ''}`}
            onClick={() => setShowConfig((v) => !v)}
            aria-label="Chat settings"
            title="Model & settings"
          >
            ⚙
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={clearChat}
            aria-label="Clear chat"
            title="Clear chat"
            disabled={messages.length === 0 && !error}
          >
            ⌫
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Minimize"
            title="Minimize"
          >
            ▬
          </button>
        </div>
      </header>

      {showConfig && (
        <div className="ask-config">
          <label>
            Model
            <select
              value={clampAskModel(model)}
              onChange={(e) => onSettings({ askModel: e.target.value })}
            >
              {ASK_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Creativity
            <input
              type="range"
              min={0}
              max={1.2}
              step={0.1}
              value={clampAskTemperature(temperature)}
              onChange={(e) =>
                onSettings({
                  askTemperature: clampAskTemperature(Number(e.target.value)),
                })
              }
            />
            <span className="ask-temp-val">
              {clampAskTemperature(temperature).toFixed(1)}
            </span>
          </label>
          <p className="ask-config-hint muted-line">
            Chat keeps turn history so follow-ups use prior answers. Card
            context (if any) is sent with every message.
          </p>
        </div>
      )}

      {context && (
        <p className="ask-context" title={context}>
          <span className="ask-context-label">Context</span>
          {context}
        </p>
      )}

      <div className="ask-messages" ref={listRef}>
        {messages.length === 0 && !loading && (
          <p className="ask-empty muted-line">
            Ask about Welsh grammar, mutations, or this card. Enter to send ·
            Shift+Enter for a new line.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`ask-bubble ask-bubble-${m.role}`}
          >
            {m.role === 'model' ? (
              <>
                {m.cached && <span className="ask-meta">cached</span>}
                <MarkdownBody text={m.text} />
              </>
            ) : (
              <p className="ask-user-text">{m.text}</p>
            )}
          </div>
        ))}
        {loading && (
          <div className="ask-bubble ask-bubble-model ask-pending">
            <span className="ask-typing">Thinking…</span>
          </div>
        )}
      </div>

      {error && <p className="ask-error">{error}</p>}

      <form className="ask-composer" onSubmit={submit}>
        <textarea
          ref={inputRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onInputKey}
          placeholder="Ask about Welsh…"
          rows={2}
          disabled={loading}
        />
        <button
          type="submit"
          className="primary-btn ask-send"
          disabled={loading || !question.trim()}
        >
          {loading ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
