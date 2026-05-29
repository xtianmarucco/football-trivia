import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.player.createMany({
    data: [
      { name: 'Demo Player 1', score: 850 },
      { name: 'Demo Player 2', score: 700 },
      { name: 'Demo Player 3', score: 550 },
    ],
  })
  console.log('Seed completed')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
