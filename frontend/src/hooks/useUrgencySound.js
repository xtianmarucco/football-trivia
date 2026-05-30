import { useRef, useEffect } from 'react'

export function useUrgencySound(timeLeft) {
  const audioCtxRef = useRef(null)

  useEffect(() => {
    if (timeLeft > 30 || timeLeft <= 0) return

    const ctx = audioCtxRef.current ?? new AudioContext()
    audioCtxRef.current = ctx

    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type            = 'sine'
    osc.frequency.value = timeLeft <= 10 ? 1000 : 780

    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.12)
  }, [timeLeft])
}
