import { eq, sql } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import { jsonbBuildObject } from '../src/index.js'
import { users } from './db/schema.js'
import { db } from './setup.js'

const defaultUser = {
  name: 'Alice',
  email: 'alice@test.com',
  preferences: {
    theme: 'dark' as const,
    notifications: { email: true, sms: false, push: true },
    language: 'en',
    timezone: 'UTC',
  },
}

describe('jsonbBuildObject', () => {
  it('returns a jsonb object with the specified columns', async () => {
    const [{ id }] = await db.insert(users).values(defaultUser).returning({ id: users.id })

    const [row] = await db
      .select({ data: jsonbBuildObject({ id: users.id, name: users.name }) })
      .from(users)
      .where(eq(users.id, id))

    expect(row.data).toEqual({ id, name: 'Alice' })
  })

  it('supports nested jsonbBuildObject calls', async () => {
    const [{ id }] = await db.insert(users).values(defaultUser).returning({ id: users.id })

    const [row] = await db
      .select({
        data: jsonbBuildObject({
          name: users.name,
          nested: jsonbBuildObject({ id: users.id }),
        }),
      })
      .from(users)
      .where(eq(users.id, id))

    expect(row.data).toEqual({ name: 'Alice', nested: { id } })
  })

  it('supports SQL expressions as values', async () => {
    await db.insert(users).values(defaultUser)

    const [row] = await db
      .select({
        data: jsonbBuildObject({ nameUpper: sql<string>`upper(${users.name})` }),
      })
      .from(users)

    expect(row.data).toEqual({ nameUpper: 'ALICE' })
  })

  it('infers correct types for column references', async () => {
    const [{ id }] = await db.insert(users).values(defaultUser).returning({ id: users.id })

    const [row] = await db
      .select({ data: jsonbBuildObject({ id: users.id, name: users.name }) })
      .from(users)
      .where(eq(users.id, id))

    const data: { id: string; name: string } = row.data
    expect(typeof data.id).toBe('string')
    expect(typeof data.name).toBe('string')
  })
})
