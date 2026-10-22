import { useEffect, useState } from 'react'
import { formatElapsed } from '../lib/format'

/** Live elapsed clock from a start timestamp. */
export function ActivityTimer({
  startedAt,
  className,
}: {
  startedAt: number
  className?: string
}) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className={className ?? 'activity-timer'} title="Time on this activity">
      {formatElapsed(now - startedAt)}
    </span>
  )
}
