import { defineRelations } from 'drizzle-orm'
import * as schema from './schema.js'

export const relations = defineRelations(schema, (r) => ({
  users: {
    orders: r.many.orders({
      from: r.users.id,
      to: r.orders.userId,
    }),
  },
  orders: {
    user: r.one.users({
      from: r.orders.userId,
      to: r.users.id,
    }),
  },
}))
