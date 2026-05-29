/** LeaderboardPage — Visual podium for top 3 + list for positions 4–10 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { getLeaderboard } from '../services/scoreService'
import BackgroundLayout from '../components/layout/BackgroundLayout'
import GlassCard from '../components/ui/GlassCard'
import RankingSidebar from '../components/layout/RankingSidebar'

const MEDALS       = ['🥇', '🥈', '🥉']
const PODIUM_ORDER = [1, 0, 2] // visual: 2nd | 1st | 3rd

const podiumCls = [
  'border-yellow-400/50 bg-yellow-400/10 shadow-[0_0_32px_rgba(250,204,21,0.12)]',
  'border-white/20      bg-white/5',
  'border-orange-500/25 bg-orange-500/5',
]

function PodiumCard({ entry, rank, delay }) {
  const isFirst = rank === 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      className={`flex-1 flex flex-col items-center backdrop-blur-md border rounded-2xl gap-3
        ${podiumCls[rank]}
        ${isFirst ? 'p-8 scale-105' : 'p-6 mt-6'}`}
      aria-label={`${rank + 1}° lugar: ${entry.name}, ${entry.score} puntos`}
    >
      <span className={isFirst ? 'text-5xl' : 'text-4xl'} aria-hidden="true">{MEDALS[rank]}</span>
      <span className={`text-white font-bold text-center w-full truncate ${isFirst ? 'text-lg' : 'text-sm'}`}>
        {entry.name}
      </span>
      <span className={`font-black tabular-nums ${isFirst ? 'text-yellow-400 text-3xl' : 'text-white/80 text-xl'}`}>
        {entry.score.toLocaleString()}
      </span>
    </motion.div>
  )
}

export default function LeaderboardPage() {
  const { resetGame }  = useGame()
  const navigate       = useNavigate()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard()
      .then(({ data }) => setEntries(data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const top3 = entries.slice(0, 3)
  const rest  = entries.slice(3)

  return (
    <BackgroundLayout variant="night">
      <main className="max-w-[1440px] mx-auto min-h-screen flex flex-col lg:flex-row lg:justify-center gap-5 p-5 lg:p-6">

        {/* ── LEFT ── */}
        <section className="w-full lg:w-[60%] shrink-0 flex flex-col gap-6 min-w-0" aria-label="Tabla de posiciones">

          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlassCard padding="py-6 px-8" className="text-center">
              <h1 className="text-4xl font-black text-white tracking-tight">🏆 Leaderboard</h1>
              <p className="text-white/40 mt-2 text-sm">Top 10 mejores puntajes</p>
            </GlassCard>
          </motion.div>

          {loading ? (
            <p className="text-white/40 text-center py-16 text-lg" aria-live="polite">Cargando...</p>
          ) : entries.length === 0 ? (
            <p className="text-white/40 text-center py-16 text-lg">No hay puntajes todavía.</p>
          ) : (
            <>
              {/* Podium */}
              {top3.length >= 1 && (
                <div className="flex items-end gap-4" role="list" aria-label="Podio top 3">
                  {PODIUM_ORDER.map((rank) =>
                    top3[rank] ? (
                      <PodiumCard
                        key={top3[rank].id}
                        entry={top3[rank]}
                        rank={rank}
                        delay={0.1 + rank * 0.12}
                      />
                    ) : null
                  )}
                </div>
              )}

              {/* Positions 4–10 */}
              {rest.length > 0 && (
                <ol className="flex flex-col gap-3" aria-label="Posiciones 4 a 10">
                  {rest.map((entry, i) => (
                    <motion.li
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.06 }}
                    >
                      <GlassCard padding="py-4 px-6" className="flex items-center gap-4">
                        <span className="text-white/40 font-bold w-6 text-center text-sm shrink-0">
                          {i + 4}
                        </span>
                        <span className="flex-1 text-white font-semibold truncate text-lg">{entry.name}</span>
                        <span className="text-white/70 font-bold tabular-nums">{entry.score.toLocaleString()}</span>
                      </GlassCard>
                    </motion.li>
                  ))}
                </ol>
              )}
            </>
          )}

          <button
            onClick={() => { resetGame(); navigate('/') }}
            className="w-full py-4 min-h-[56px] rounded-xl bg-white/10 border border-white/20
                       hover:bg-white/20 hover:border-white/60 hover:text-emerald-400
                       active:scale-95 text-white text-lg font-bold
                       transition-all duration-200 cursor-pointer
                       focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Jugar de nuevo
          </button>

        </section>

        {/* ── RIGHT — sidebar ── */}
        <aside className="w-full lg:w-[30%] shrink-0" aria-label="Ranking en vivo">
          <RankingSidebar />
        </aside>

      </main>
    </BackgroundLayout>
  )
}
