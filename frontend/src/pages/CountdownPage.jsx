/** CountdownPage — Pre-game 3-2-1 countdown centered on day background */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import BackgroundLayout from '../components/layout/BackgroundLayout'
import CountdownDisplay from '../components/CountdownDisplay'
import { useTimer } from '../hooks/useTimer'

export default function CountdownPage() {
  const { playerName, beginPlaying } = useGame()
  const navigate = useNavigate()

  useEffect(() => {
    if (!playerName) navigate('/')
  }, [playerName, navigate])

  const timeLeft = useTimer(3, () => {
    beginPlaying()
    setTimeout(() => navigate('/game'), 600)
  })

  const display = timeLeft > 0 ? timeLeft : '¡GO!'

  return (
    <BackgroundLayout variant="day">
      <main className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 py-12">
        <p className="text-white/70 text-3xl text-center">
          <span className="text-white font-bold">{playerName}</span>, preparate
        </p>
        <CountdownDisplay count={display} />
        <p className="text-white/30 text-xs uppercase tracking-widest">El juego comienza pronto</p>
      </main>
    </BackgroundLayout>
  )
}
