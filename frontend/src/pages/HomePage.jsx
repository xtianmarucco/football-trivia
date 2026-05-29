/** HomePage — Title + form unified inside a single glassmorphism card */
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import BackgroundLayout from '../components/layout/BackgroundLayout'
import GlassCard from '../components/ui/GlassCard'
import PlayerNameInput from '../components/PlayerNameInput'

export default function HomePage() {
  const { startGame } = useGame()
  const navigate = useNavigate()

  function handleStart(name) {
    startGame(name)
    navigate('/countdown')
  }

  return (
    <BackgroundLayout variant="day">
      <main className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md flex flex-col gap-5">

          {/* ── Unified glass card — no divider, single visual flow ── */}
          <GlassCard elevated blur="xl" padding="p-10" className="rounded-3xl w-full">

            {/* Hero: logo → title → subtitle — 8px gaps per spec */}
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-6xl select-none" aria-hidden="true">⚽</span>
              <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
                Trivia Futbol Grido
              </h1>
              <p className="text-white/60 text-base">
                ¿Cuánto sabés de fútbol mundial?
              </p>
            </div>

            {/* Form — 32px below subtitle per spec */}
            <div className="flex flex-col gap-4 w-full mt-8">
              <p className="text-white/40 text-center text-xs uppercase tracking-[0.15em] font-semibold">
                Ingresá tu nombre para empezar
              </p>
              <PlayerNameInput onSubmit={handleStart} />
            </div>

          </GlassCard>

          {/* Footer */}
          <p className="text-center text-white/30 text-sm tracking-wide">
            5 minutos · Opción múltiple · Bonus por velocidad
          </p>

        </div>
      </main>
    </BackgroundLayout>
  )
}
