import { SQLocalDrizzle } from 'sqlocal/drizzle';
import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { sqliteTable, int, text } from 'drizzle-orm/sqlite-core';

// 1. Initialize DB
const { driver, batchDriver } = new SQLocalDrizzle('database.sqlite3');
export const db = drizzle(driver, batchDriver);
console.log('DB Initialized ✅');

// 2. Define Schemas
export const groceries = sqliteTable('groceries', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});
console.log('Schemas Defined ✅');

// 3. Run Migrations
/// 3.1 Define Migration

// 4. Make Queries
try {
  const data = await db
    .select({ name: groceries.name })
    .from(groceries)
    .orderBy(groceries.name)
    .all();

  console.log('Queries Made ✅');
  console.log(data);
} catch (err) {
  console.error('❌ Query failed:', err);
}
