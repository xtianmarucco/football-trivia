/** QuestionCard — Large-text question with category/difficulty badges and progress counter */
import { motion } from 'framer-motion'
import GlassCard from './ui/GlassCard'

const difficultyBadge = {
  easy:   { label: 'Fácil',   cls: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10' },
  medium: { label: 'Medio',   cls: 'text-yellow-400  border-yellow-400/40  bg-yellow-400/10'  },
  hard:   { label: 'Difícil', cls: 'text-rose-400    border-rose-400/40    bg-rose-400/10'    },
}

/**
 * @param {{
 *   question: string,
 *   category: string,
 *   difficulty: 'easy'|'medium'|'hard',
 *   questionNumber?: number,
 *   totalQuestions?: number
 * }} props
 */
export default function QuestionCard({ question, category, difficulty, questionNumber, totalQuestions }) {
  const badge = difficultyBadge[difficulty] ?? difficultyBadge.easy

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <GlassCard elevated padding="py-5 px-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            {questionNumber != null && (
              <span className="text-white/35 text-sm tabular-nums font-medium">
                {questionNumber}/{totalQuestions}
              </span>
            )}
            <span className="text-white/50 text-sm uppercase tracking-widest">{category}</span>
          </div>
          <span className={`text-sm font-bold uppercase tracking-wide border rounded-full px-4 py-1 ${badge.cls}`}>
            {badge.label}
          </span>
        </div>
        {/* Large text for big-screen projection */}
        <p className="text-white text-2xl lg:text-3xl xl:text-4xl font-bold leading-snug">
          {question}
        </p>
      </GlassCard>
    </motion.div>
  )
}
