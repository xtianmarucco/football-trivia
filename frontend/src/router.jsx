/** router.jsx — All route definitions in one place (rule 2) */
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CountdownPage from './pages/CountdownPage'
import GamePage from './pages/GamePage'

const GameOverPage    = lazy(() => import('./pages/GameOverPage'))
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'))

export default function AppRouter() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/countdown"   element={<CountdownPage />} />
        <Route path="/game"        element={<GamePage />} />
        <Route path="/gameover"    element={<GameOverPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </Suspense>
  )
}
