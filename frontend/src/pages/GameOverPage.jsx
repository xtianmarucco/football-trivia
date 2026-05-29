/** GameOverPage — Final score with animated count-up, posts score once via scoreService */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { postScore } from '../services/scoreService'
import BackgroundLayout from '../components/layout/BackgroundLayout'
import GlassCard from '../components/ui/GlassCard'

function useCountUp(target, duration = 1600, delay = 500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!target) return
    let raf
    const startAt = performance.now() + delay
    function step(now) {
      if (now < startAt) { raf = requestAnimationFrame(step); return }
      const progress = Math.min((now - startAt) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, delay])
  return count
}

function performanceLabel(score) {
  if (score >= 3000) return { text: '⚡ ¡Crack total!',      cls: 'text-yellow-400  border-yellow-400/40  bg-yellow-400/10'  }
  if (score >= 1500) return { text: '🔥 ¡Muy bien!',         cls: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10' }
  return               { text: '💪 ¡Seguí practicando!',     cls: 'text-white/60    border-white/20        bg-white/5'        }
}

export default function GameOverPage() {
  const { playerName, score, resetGame } = useGame()
  const navigate      = useNavigate()
  const didSubmitRef  = useRef(false)
  const [error, setError] = useState(null)
  const displayScore  = useCountUp(score)
  const label         = performanceLabel(score)

  useEffect(() => {
    if (!playerName) { navigate('/'); return }
    if (didSubmitRef.current) return
    didSubmitRef.current = true

    async function submit() {
      const { error: err } = await postScore(playerName, score)
      if (!err) { localStorage.removeItem('pendingScore'); return }

      // First failure: persist and retry once (rule 6.4)
      localStorage.setItem('pendingScore', JSON.stringify({ name: playerName, score }))
      const { error: retryErr } = await postScore(playerName, score)
      if (!retryErr) {
        localStorage.removeItem('pendingScore')
      } else {
        setError('Algo salió mal, intentá de nuevo.')
      }
    }

    submit()
  }, [playerName, score, navigate])

  return (
    <BackgroundLayout variant="night">
      <main className="min-h-screen flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          className="w-full max-w-md"
        >
          <GlassCard elevated padding="p-10" className="flex flex-col items-center gap-8">

            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-8xl select-none"
              aria-hidden="true"
            >
              🏆
            </motion.span>

            <div className="text-center flex flex-col gap-2">
              <p className="text-white/60 text-xl font-medium">{playerName}</p>
              <p className="text-white/30 text-xs uppercase tracking-widest">Puntaje final</p>
              <motion.p
                className="text-8xl font-black text-yellow-400 leading-none tabular-nums mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                aria-label={`Puntaje: ${score}`}
              >
                {displayScore.toLocaleString()}
              </motion.p>
            </div>

            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className={`px-5 py-2 rounded-full text-sm font-bold border ${label.cls}`}
            >
              {label.text}
            </motion.span>

            {error && (
              <p role="alert" className="text-rose-400 text-sm text-center -mt-2">{error}</p>
            )}

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => navigate('/leaderboard')}
                className="w-full py-4 min-h-[56px] rounded-xl bg-emerald-500 hover:bg-emerald-400
                           active:scale-95 text-white text-lg font-bold
                           transition-all duration-200 cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              >
                Ver Leaderboard
              </button>
              <button
                onClick={() => { resetGame(); navigate('/') }}
                className="w-full py-4 min-h-[56px] rounded-xl bg-white/10 border border-white/20
                           hover:bg-white/20 hover:border-white/60 active:scale-95
                           text-white text-lg font-bold transition-all duration-200 cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                Jugar de nuevo
              </button>
            </div>

          </GlassCard>
        </motion.div>
      </main>
    </BackgroundLayout>
  )
}
