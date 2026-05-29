/** AnswerOptions — 2-col answer grid with glass buttons, framer-motion feedback, and icon indicators */
import { motion } from 'framer-motion'

const LETTERS = ['A', 'B', 'C', 'D']

function badgeContent(option, selected, correct, letter) {
  if (!selected) return letter
  if (option === correct) return '✓'
  if (option === selected) return '✗'
  return letter
}

function getClass(option, selected, correct) {
  const base = `
    w-full rounded-2xl border px-5 py-4 text-left font-semibold
    transition-all duration-200 ease-in-out flex items-center gap-3
    min-h-[72px] focus:outline-none focus:ring-2 focus:ring-white/30
  `
  if (!selected) {
    return `${base} bg-white/10 border-white/20 text-white
      hover:bg-white/20 hover:border-white/60 active:scale-[0.98] cursor-pointer`
  }
  if (option === correct) return `${base} bg-emerald-500/40 border-emerald-400 text-white cursor-default`
  if (option === selected) return `${base} bg-rose-500/40   border-rose-400   text-white cursor-default`
  return `${base} bg-white/10 border-white/10 text-white/30 opacity-50 cursor-default pointer-events-none`
}

function getMotion(option, selected, correct) {
  if (!selected) return {}
  if (option === correct) return { animate: { scale: [1, 1.03, 1] }, transition: { duration: 0.35 } }
  if (option === selected) return { animate: { x: [-9, 9, -6, 6, -3, 3, 0] }, transition: { duration: 0.4 } }
  return {}
}

/**
 * @param {{
 *   options: string[],
 *   correct: string,
 *   selected: string|null,
 *   onSelect: (o: string) => void
 * }} props
 */
export default function AnswerOptions({ options, correct, selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
      {options.map((option, i) => (
        <motion.button
          key={option}
          onClick={() => !selected && onSelect(option)}
          disabled={!!selected}
          className={getClass(option, selected, correct)}
          {...getMotion(option, selected, correct)}
        >
          <span className={`
            shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black
            ${!selected           ? 'bg-white/15         text-white'      :
              option === correct  ? 'bg-emerald-400/30   text-emerald-300' :
              option === selected ? 'bg-rose-400/30      text-rose-300'    :
                                    'bg-white/10         text-white/30'}
          `}>
            {badgeContent(option, selected, correct, LETTERS[i])}
          </span>
          <span className="text-lg leading-snug">{option}</span>
        </motion.button>
      ))}
    </div>
  )
}
