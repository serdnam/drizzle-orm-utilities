# @serdnam/drizzle-orm-utilities

Miscellaneous helper functions and type utilities for [Drizzle ORM](https://orm.drizzle.team).

> **Disclaimer:** This package is an independent community project and is not affiliated with, endorsed by, or maintained by the Drizzle team.

---

## Requirements

- Node.js `>=18.0.0`
- `drizzle-orm` `^1.0.0-beta.22` (peer dependency)

## Installation

```bash
npm install @serdnam/drizzle-orm-utilities
```

`drizzle-orm` must be installed separately as a peer dependency:

```bash
npm install drizzle-orm
```

## Utilities

### `jsonbBuildObject`

Constructs a PostgreSQL `jsonb_build_object(...)` expression with full TypeScript type inference. The return type is automatically derived from the columns and SQL expressions you pass in, so the result is typed end-to-end without any manual annotation.

#### Signature

```ts
function jsonbBuildObject<T extends Record<string, Column | SQL>>(
  obj: T
): SQL<{ [K in keyof T]: ... }>
```

#### Basic usage

```ts
import { jsonbBuildObject } from '@serdnam/drizzle-orm-utilities'
import { db } from './db'
import { users } from './schema'

const rows = await db.select({
  summary: jsonbBuildObject({
    id: users.id,
    name: users.name,
  }),
}).from(users)

// rows[0].summary is typed as { id: string; name: string }
console.log(rows[0].summary) // { id: '...', name: 'Alice' }
```

#### With SQL expressions

Any `SQL` value (created with the `sql` tag) can be used alongside column references. The inferred type comes from the generic you provide to `sql<T>`.

```ts
import { sql } from 'drizzle-orm'
import { jsonbBuildObject } from '@serdnam/drizzle-orm-utilities'

const rows = await db.select({
  data: jsonbBuildObject({
    name: users.name,
    nameUpper: sql<string>`upper(${users.name})`,
  }),
}).from(users)

// rows[0].data is typed as { name: string; nameUpper: string }
```

#### Nested calls

`jsonbBuildObject` returns an `SQL` expression, so it can be nested inside another call to build deeply structured JSONB objects:

```ts
const rows = await db.select({
  data: jsonbBuildObject({
    name: users.name,
    address: jsonbBuildObject({
      city: users.city,
      country: users.country,
    }),
  }),
}).from(users)

// rows[0].data is typed as:
// { name: string; address: { city: string; country: string } }
```

### `InferColumnDataType`

A type-only utility that extracts the TypeScript data type from a single Drizzle column. Useful when you need the inferred type of a column without going through a full `select` result.

#### Signature

```ts
type InferColumnDataType<T extends Column> = ...
```

#### Usage

```ts
import type { InferColumnDataType } from '@serdnam/drizzle-orm-utilities'
import { users } from './schema'

// Extracts the data type of a single column
type UserId = InferColumnDataType<typeof users.id>     // string
type UserName = InferColumnDataType<typeof users.name> // string

// Useful for typing helper functions that accept a column
function logColumn<T extends Column>(col: T, value: InferColumnDataType<T>) {
  console.log(value)
}
```

---

## Compatibility

The package ships both ESM and CommonJS builds, and works across all modern module resolution strategies.

| Environment | Supported |
|---|---|
| Node.js ESM (`import`) | ✅ |
| Node.js CJS (`require`) | ✅ |
| Bundlers (Vite, webpack, esbuild) | ✅ |
| TypeScript (strict mode) | ✅ |
| Drizzle ORM `^1.0.0-beta.22` | ✅ |

---

## Contributing

Integration tests run against a real PostgreSQL database started via Docker Compose.

```bash
# Start the database
npm run db:up

# Run migrations
npm run db:migrate

# Run tests
npm test

# Stop the database
npm run db:down
```

To build the package locally:

```bash
npm run build
```

To validate the package before publishing:

```bash
npm run check
```

---

## License

MIT
