import type { AccountPhase, AccountUser } from '../lib/account'

export function SignInGate({
  phase,
  detail,
  onSignIn,
}: {
  phase: AccountPhase
  detail: string
  onSignIn: () => void
}) {
  const waiting = phase === 'checking' || phase === 'saving'
  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true" />
      <main className="sign-in-gate">
        <div className="sign-in-card">
          <span className="brand-mark">WF</span>
          <h1>Welsh Flashcards</h1>
          <p>Sign in to study. Your reviews stay on this Google account.</p>
          {phase === 'checking' && <p>Checking your account…</p>}
          {phase === 'saving' && <p>Opening Google sign-in…</p>}
          {phase === 'error' && <p className="is-error">{detail}</p>}
          <button
            type="button"
            className="primary-btn"
            disabled={waiting}
            onClick={onSignIn}
          >
            Continue with Google
          </button>
        </div>
      </main>
    </div>
  )
}

export function AccountBar({
  phase,
  detail,
  user,
  onSignIn,
  onSignOut,
}: {
  phase: AccountPhase
  detail: string
  user: AccountUser | null
  onSignIn: () => void
  onSignOut: () => void
}) {
  const showSignIn = phase === 'signed-out' || (phase === 'error' && !user)
  const showSignOut = Boolean(user) && phase !== 'checking'
  return (
    <div className="account-bar">
      <p className={phase === 'error' ? 'is-error' : undefined}>{detail}</p>
      {showSignIn && (
        <button type="button" className="ghost-btn" onClick={onSignIn}>
          Sign in
        </button>
      )}
      {showSignOut && (
        <button type="button" className="ghost-btn" onClick={onSignOut}>
          Sign out
        </button>
      )}
    </div>
  )
}
