import { createContext, useContext, useState, useCallback } from 'react'
import questions from '../data/questions.json'

const GameContext = createContext(null)

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function shuffleQuestions(qs) {
  return shuffleArray(qs).map((q) => ({ ...q, options: shuffleArray(q.options) }))
}

export function GameProvider({ children }) {
  const [playerName, setPlayerName] = useState('')
  const [score, setScore] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [gameStatus, setGameStatus] = useState('idle')

  const startGame = useCallback((name) => {
    setPlayerName(name)
    setScore(0)
    setCurrentQuestionIndex(0)
    setShuffledQuestions(shuffleQuestions(questions))
    setGameStatus('countdown')
  }, [])

  const beginPlaying = useCallback(() => {
    setGameStatus('playing')
  }, [])

  const answerQuestion = useCallback((points) => {
    setScore((prev) => prev + points)
    setCurrentQuestionIndex((prev) => prev + 1)
  }, [])

  const endGame = useCallback(() => {
    setGameStatus('gameover')
  }, [])

  const resetGame = useCallback(() => {
    setPlayerName('')
    setScore(0)
    setCurrentQuestionIndex(0)
    setShuffledQuestions([])
    setGameStatus('idle')
  }, [])

  const currentQuestion = shuffledQuestions[currentQuestionIndex] ?? null

  return (
    <GameContext.Provider
      value={{
        playerName,
        score,
        currentQuestion,
        currentQuestionIndex,
        shuffledQuestions,
        gameStatus,
        startGame,
        beginPlaying,
        answerQuestion,
        endGame,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within GameProvider')
  return context
}
