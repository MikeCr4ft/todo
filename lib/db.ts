import { PrismaClient } from "@/src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// Attach the client to globalThis so Next.js hot-reloads don't create a new
// connection pool on every file change. In production this branch never runs
// because the module is only loaded once.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Prisma 7 with the new `prisma-client` generator requires a driver adapter
// instead of a plain URL. PrismaPg reads DATABASE_URL and handles the connection.
function makeClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? makeClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
