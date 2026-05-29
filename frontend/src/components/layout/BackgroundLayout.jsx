/** BackgroundLayout — Fixed stadium background with dark overlay (rule 4.1) */
import stadiumWeb from '../../assets/stadium_background_web.webp'

/**
 * @param {{ variant?: 'day' | 'night', children: React.ReactNode }} props
 */
export default function BackgroundLayout({ variant = 'night', children }) {
  return (
    <div className="relative min-h-screen">
      {/* Fixed image layer — object-cover fills 100% viewport at all times */}
      <div className="fixed inset-0 z-0">
        <img
          src={stadiumWeb}
          alt=""
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-[center_65%]"
        />
        {/* Dark overlay — rule 4.1: bg-black/55 */}
        <div className={`absolute inset-0 ${variant === 'night' ? 'bg-black/70' : 'bg-black/55'}`} />
      </div>

      {/* Page content sits above the fixed background */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  )
}
