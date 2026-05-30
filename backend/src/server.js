import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import scoreRoutes from './routes/scoreRoutes.js'
import { errorMiddleware } from './middlewares/errorMiddleware.js'

const app = express()
const PORT = process.env.API_PORT || 3001

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

app.use('/api/scores', scoreRoutes)
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
