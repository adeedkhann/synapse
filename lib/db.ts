import { PrismaClient } from './generated/prisma/client' // Ensure this relative path correctly points to the 'generated' folder from THIS file

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Cleaner, safer way to declare the global type without using ReturnType on a function block directly
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db