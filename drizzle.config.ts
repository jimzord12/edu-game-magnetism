// import type { Config } from 'drizzle-kit';

// export default {
//   schema: './src/db/schema.ts',
//   out: './drizzle/migrations',
//   driver: 'durable-sqlite',
//   dbCredentials: {
//     url: 'file:drizzle', // irrelevant for sqlocal, just required by config
//   },
//   dialect: 'sqlite',
// } satisfies Config;

import type { Config } from 'drizzle-kit';

export default {
  dialect: 'sqlite',
  schema: './src/db/schema.ts', // Path to your schema file
  out: './drizzle/migrations', // Output directory for migration files
  dbCredentials: {
    url: 'migrations.db', // A temporary SQLite file for migrations (can be in memory if you use 'sqlite-proxy')
  },
} satisfies Config;
