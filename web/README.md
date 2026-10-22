# Colloquial Welsh Flashcards

Anki-style **FSRS** app for *Colloquial Welsh* (Gareth King), with Gemini Ask + Welsh TTS.

## Run

```bash
cd web
npm install
npm run dev
```

Optional: put your Gemini key in `web/.env`:

```
VITE_GEMINI_API_KEY=AIza...
```

Or paste it under **Settings** in the app.

## Keys

| Key | Action |
|-----|--------|
| Space | Show answer |
| 1–4 | Again / Hard / Good / Easy |
| R | Speak Welsh |

## Features

- Unlimited new cards (no daily cap)
- CY→EN, EN→CY, or both (separate schedules)
- Dark mode default (switchable)
- Gemini Q&A + TTS with IndexedDB cache
