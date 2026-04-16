import { type Column, type InferColumnsDataTypes } from 'drizzle-orm'

export type InferColumnDataType<T extends Column> = InferColumnsDataTypes<{ 'col': T }>['col']