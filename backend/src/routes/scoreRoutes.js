import { Router } from 'express'
import { saveScore, getLeaderboard } from '../controllers/scoreController.js'
import { validateScore } from '../middlewares/validateMiddleware.js'

const router = Router()

router.post('/', validateScore, saveScore)
router.get('/leaderboard', getLeaderboard)

export default router
