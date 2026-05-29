/** RankingSidebar — Live leaderboard sidebar, polls the API every 30s */
import { useState, useEffect } from 'react'
import { getLeaderboard } from '../../services/scoreService'
import GlassCard from '../ui/GlassCard'

const medals = ['🥇', '🥈', '🥉']

export default function RankingSidebar() {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    const load = () => getLeaderboard().then(({ data }) => { if (data) setEntries(data) })
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <GlassCard padding="p-5" className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">🏆</span>
        <h2 className="text-white font-bold text-lg tracking-tight">Top 10</h2>
      </div>

      <ol className="flex-1 overflow-y-auto space-y-2" aria-label="Ranking de jugadores">
        {entries.length === 0 && (
          <li className="text-white/40 text-sm text-center py-8">Sin puntajes aún</li>
        )}
        {entries.map((entry, i) => (
          <li
            key={entry.id}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors
              ${i === 0 ? 'bg-yellow-400/10 border border-yellow-400/30' : 'bg-white/5'}`}
          >
            <span className="w-6 text-center shrink-0 text-base" aria-hidden="true">
              {i < 3 ? medals[i] : <span className="text-white/40 text-sm font-bold">{i + 1}</span>}
            </span>
            <span className="flex-1 truncate text-white/90 text-sm font-medium">{entry.name}</span>
            <span className={`text-sm font-bold tabular-nums shrink-0 ${i === 0 ? 'text-yellow-400' : 'text-white/70'}`}>
              {entry.score.toLocaleString()}
            </span>
          </li>
        ))}
      </ol>
    </GlassCard>
  )
}
