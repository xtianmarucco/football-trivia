/** GamePage — Two-column game layout with live ranking sidebar */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { useTimer } from '../hooks/useTimer'
import BackgroundLayout from '../components/layout/BackgroundLayout'
import RankingSidebar from '../components/layout/RankingSidebar'
import TimerBar from '../components/TimerBar'
import ScoreDisplay from '../components/ScoreDisplay'
import QuestionCard from '../components/QuestionCard'
import AnswerOptions from '../components/AnswerOptions'
import { GAME_DURATION_SECONDS, QUESTION_TIME_SECONDS, SPEED_BONUS_MAX } from '../utils/constants'

export default function GamePage() {
  const {
    playerName, score, currentQuestion,
    currentQuestionIndex, shuffledQuestions,
    answerQuestion, endGame,
  } = useGame()

  const navigate = useNavigate()
  const [selected, setSelected]       = useState(null)
  const [pointsPopup, setPointsPopup] = useState(null)
  const questionStartRef              = useRef(Date.now())

  useEffect(() => {
    if (!playerName) navigate('/')
  }, [playerName, navigate])

  useEffect(() => {
    if (!currentQuestion) {
      endGame()
      navigate('/gameover')
    } else {
      questionStartRef.current = Date.now()
      setSelected(null)
      setPointsPopup(null)
    }
  }, [currentQuestion, endGame, navigate])

  const timeLeft = useTimer(GAME_DURATION_SECONDS, () => {
    endGame()
    navigate('/gameover')
  })

  function handleAnswer(option) {
    if (selected) return
    setSelected(option)

    const elapsed    = (Date.now() - questionStartRef.current) / 1000
    const isCorrect  = option === currentQuestion.correct
    const speedBonus = isCorrect
      ? Math.max(0, Math.round(
          ((QUESTION_TIME_SECONDS - Math.min(elapsed, QUESTION_TIME_SECONDS)) / QUESTION_TIME_SECONDS)
          * SPEED_BONUS_MAX
        ))
      : 0
    const points = isCorrect ? currentQuestion.points + speedBonus : 0

    setPointsPopup({ points, correct: isCorrect })
    setTimeout(() => answerQuestion(points), 800)
  }

  if (!currentQuestion) return null

  return (
    <BackgroundLayout variant="night">
      <main className="max-w-auto mx-auto min-h-screen flex flex-col lg:flex-row lg:justify-center gap-5 p-5 lg:p-6">

        {/* ── LEFT — question + controls ── */}
        <section className="w-full lg:w-[60%] shrink-0 flex flex-col gap-6 min-w-0" aria-label="Pregunta actual">

          {/* Timer + Score — same height via matching padding token */}
          <div className="flex items-stretch gap-4">
            <div className="flex-1"><TimerBar timeLeft={timeLeft} /></div>
            <ScoreDisplay score={score} />
          </div>

          {/* Question + Answers */}
          <div className="flex-1 flex flex-col justify-center gap-5 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5"
              >
                <QuestionCard
                  question={currentQuestion.question}
                  category={currentQuestion.category}
                  difficulty={currentQuestion.difficulty}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={shuffledQuestions.length}
                />
                <AnswerOptions
                  options={currentQuestion.options}
                  correct={currentQuestion.correct}
                  selected={selected}
                  onSelect={handleAnswer}
                />
              </motion.div>
            </AnimatePresence>

            {/* Points-gained popup */}
            <AnimatePresence>
              {pointsPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.8 }}
                  animate={{ opacity: 1, y: -28, scale: 1 }}
                  exit={{ opacity: 0, y: -60, scale: 0.9 }}
                  transition={{ duration: 0.45 }}
                  aria-live="polite"
                  className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-20"
                >
                  <span className={`text-3xl font-black px-6 py-2 rounded-2xl border
                    ${pointsPopup.correct
                      ? 'text-emerald-400 bg-emerald-400/15 border-emerald-400/40'
                      : 'text-rose-400   bg-rose-400/15   border-rose-400/40'}`}>
                    {pointsPopup.correct ? `+${pointsPopup.points}` : '✕'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── RIGHT — live ranking ── */}
        <aside className="w-full lg:w-[30%] shrink-0" aria-label="Ranking en vivo">
          <RankingSidebar />
        </aside>

      </main>
    </BackgroundLayout>
  )
}
