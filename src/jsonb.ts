import { type Column, type SQL, sql } from 'drizzle-orm'
import type { InferColumnDataType } from './types.js'

export function jsonbBuildObject<T extends Record<string, Column | SQL>>(obj: T) {
  const mapped = Object.entries(obj).map(([k, v]) => sql`${k}::text, ${v}`)
  return sql<{
    [K in keyof T]: T[K] extends Column
      ? InferColumnDataType<T[K]>
      : T[K] extends SQL<infer U>
        ? U
        : never
  }>`jsonb_build_object(${sql.join(mapped, sql`, `)})`
}

