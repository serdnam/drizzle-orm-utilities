import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'
import { afterAll, beforeAll, beforeEach } from 'vitest'

const __dirname = dirname(fileURLToPath(import.meta.url))

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://drizzle:drizzle@localhost:5432/playground'

const client = postgres(connectionString)
export const db = drizzle({ client })

beforeAll(async () => {
  const migrationsFolder = join(__dirname, 'db', 'migrations')
  const migrationClient = postgres(connectionString, { max: 1 })
  const migrationDb = drizzle({ client: migrationClient })
  await migrate(migrationDb, { migrationsFolder })
  await migrationClient.end()
})

beforeEach(async () => {
  await db.execute(sql`TRUNCATE TABLE orders, products, users RESTART IDENTITY CASCADE`)
})

afterAll(async () => {
  await client.end()
})
