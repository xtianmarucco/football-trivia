import { PrismaPg } from '@prisma/adapter-pg'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

export async function saveScore(req, res, next) {
  try {
    const { name, score } = req.body
    const player = await prisma.player.create({ data: { name, score } })
    res.status(201).json({ success: true, data: player })
  } catch (error) {
    next(error)
  }
}

export async function getLeaderboard(req, res, next) {
  try {
    const players = await prisma.player.findMany({
      orderBy: { score: 'desc' },
      take: 10,
      select: { id: true, name: true, score: true, createdAt: true },
    })
    res.json({ success: true, data: players })
  } catch (error) {
    next(error)
  }
}
