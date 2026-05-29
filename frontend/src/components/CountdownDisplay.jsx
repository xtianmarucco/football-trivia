/** CountdownDisplay — Animated scale-in number for the pre-game countdown */
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from './ui/GlassCard'

/** @param {{ count: number | string }} props */
export default function CountdownDisplay({ count }) {
  return (
    <GlassCard elevated className="flex items-center justify-center w-52 h-52 rounded-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.3, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="select-none"
        >
          {typeof count === 'number'
            ? <span className="text-[7rem] font-black text-white leading-none">{count}</span>
            : <span className="text-4xl font-black text-emerald-400 leading-none">{count}</span>}
        </motion.div>
      </AnimatePresence>
    </GlassCard>
  )
}
