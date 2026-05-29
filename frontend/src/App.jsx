import { GameProvider } from './context/GameContext.jsx'
import AppRouter from './router.jsx'

export default function App() {
  return (
    <GameProvider>
      <AppRouter />
    </GameProvider>
  )
}
