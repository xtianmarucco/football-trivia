/** GlassCard — Base glassmorphism container for all UI sections (rule 3.3) */
export default function GlassCard({ children, className = '', elevated = false, padding = 'p-6', blur = 'md' }) {
  return (
    <div
      className={`
        ${elevated ? 'bg-white/15' : 'bg-white/10'}
        ${blur === 'xl' ? 'backdrop-blur-xl' : 'backdrop-blur-md'}
        border border-white/20
        rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        ${padding} ${className}
      `}
    >
      {children}
    </div>
  )
}
