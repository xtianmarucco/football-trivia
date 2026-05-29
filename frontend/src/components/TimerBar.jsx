/** TimerBar — Countdown bar that shifts emerald→yellow→rose. Announces time via aria-live. */
import GlassCard from './ui/GlassCard'
import { GAME_DURATION_SECONDS } from '../utils/constants'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** @param {{ timeLeft: number }} props */
export default function TimerBar({ timeLeft }) {
  const pct      = Math.max(0, (timeLeft / GAME_DURATION_SECONDS) * 100)
  const isLow    = timeLeft <= 30
  const isMedium = timeLeft > 30 && timeLeft <= 60

  const timeColor = isLow ? 'text-rose-500' : isMedium ? 'text-yellow-400' : 'text-emerald-400'
  const barColor  = isLow ? 'bg-rose-500'   : isMedium ? 'bg-yellow-400'   : 'bg-emerald-400'

  return (
    <GlassCard padding="py-4 px-5" className={isLow ? 'animate-pulse-glow' : ''}>
      <div className="flex items-center gap-4">
        <span
          className={`text-3xl font-black tabular-nums w-16 shrink-0 tracking-tight ${timeColor}`}
          aria-live="polite"
          aria-label={`Tiempo restante: ${formatTime(timeLeft)}`}
        >
          {formatTime(timeLeft)}
        </span>
        <div
          role="progressbar"
          aria-valuenow={timeLeft}
          aria-valuemax={GAME_DURATION_SECONDS}
          className="flex-1 h-4 rounded-full overflow-hidden bg-white/10"
        >
          <div
            className={`h-full rounded-full timer-bar ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </GlassCard>
  )
}
