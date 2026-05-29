/** ScoreDisplay — Glass pill with large gold score number, same height as TimerBar */
import GlassCard from './ui/GlassCard'

/** @param {{ score: number }} props */
export default function ScoreDisplay({ score }) {
  return (
    <GlassCard padding="py-4 px-6" className="text-center shrink-0 min-w-[100px]">
      <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Score</p>
      <p className="text-4xl font-black text-yellow-400 tabular-nums leading-none drop-shadow-[0_0_12px_rgba(250,204,21,0.45)]">
        {score.toLocaleString()}
      </p>
    </GlassCard>
  )
}
