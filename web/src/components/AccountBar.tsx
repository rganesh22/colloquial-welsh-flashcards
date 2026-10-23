import type { AccountPhase, AccountUser } from '../lib/account'

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
