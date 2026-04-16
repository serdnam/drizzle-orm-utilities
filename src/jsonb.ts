import { type Column, type InferColumnsDataTypes, type SQL, sql } from 'drizzle-orm'

export function jsonbBuildObject<T extends Record<string, Column | SQL>>(obj: T) {
  const mapped = Object.entries(obj).map(([k, v]) => sql`${k}::text, ${v}`)
  return sql<{
    [K in keyof T]: T[K] extends Column
      ? InferColumnsDataTypes<{ [P in K]: T[K] }>[K]
      : T[K] extends SQL<infer U>
        ? U
        : never
  }>`jsonb_build_object(${sql.join(mapped, sql`, `)})`
}
