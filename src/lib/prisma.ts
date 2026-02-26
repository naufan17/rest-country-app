import { Pool } from 'pg'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

const connectionString = process.env.DATABASE_URL

const pool = globalForPrisma.pool || new Pool({ connectionString })
const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') {
  // Clear the singleton to ensure new schema changes are picked up on reload
  globalForPrisma.prisma = undefined
  globalForPrisma.prisma = prisma
  globalForPrisma.pool = pool
}
