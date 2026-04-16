import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './tests/db/schema.ts',
  out: './tests/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://drizzle:drizzle@localhost:5432/playground',
  },
  verbose: true,
  strict: true,
})
