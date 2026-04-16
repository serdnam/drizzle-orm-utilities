import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const migrationsFolder = join(__dirname, 'migrations')

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://drizzle:drizzle@localhost:5432/playground'

const client = postgres(connectionString, { max: 1 })
const db = drizzle({ client })

console.log('Running migrations from:', migrationsFolder)

await migrate(db, { migrationsFolder })
console.log('Migrations complete.')

await client.end()
