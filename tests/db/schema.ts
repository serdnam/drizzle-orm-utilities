import { pgTable, uuid, text, numeric, timestamp, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core'

export type UserPreferences = {
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  language: string
  timezone: string
}

export type ProductMetadata = {
  tags: string[]
  attributes: Record<string, string | number | boolean>
  dimensions?: {
    weight: number
    width: number
    height: number
    depth: number
    unit: 'cm' | 'in'
  }
  supplier?: {
    name: string
    sku: string
    leadTimeDays: number
  }
}

export type OrderItem = {
  productId: string
  productName: string
  quantity: number
  unitPrice: string
}

export type ShippingAddress = {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
}

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    preferences: jsonb('preferences').$type<UserPreferences>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('users_email_idx').on(t.email)],
)

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    metadata: jsonb('metadata').$type<ProductMetadata>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('products_name_idx').on(t.name)],
)

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: text('status', {
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    })
      .notNull()
      .default('pending'),
    items: jsonb('items').$type<OrderItem[]>().notNull(),
    shippingAddress: jsonb('shipping_address').$type<ShippingAddress>().notNull(),
    totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('orders_user_id_idx').on(t.userId),
    index('orders_status_idx').on(t.status),
  ],
)
