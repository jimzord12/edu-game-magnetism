import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { SQLocalDrizzle } from 'sqlocal/drizzle';

import { runMigrations } from './runMigrations';
import { _getTables } from './helpers';
import { schema } from './schema';

const {
  driver,
  batchDriver,
  sql,
  getDatabaseInfo,
  getDatabaseFile,
  deleteDatabaseFile,
} = new SQLocalDrizzle('MyGameDB.sqlite3');
export const db = drizzle(driver, batchDriver, {
  schema, // This is required for type inference by Drizzle ORM
  logger: true,
});

// Initialize database (run once)
export async function initDB() {
  runMigrations(sql);
}

export const getDBInfo = getDatabaseInfo;
export const getTables = () => _getTables(sql);
export const getDBFile = getDatabaseFile; // Export getDatabaseFile function for downloading database
export const deleteDBFile = deleteDatabaseFile; // Export deleteDatabaseFile function for database reset
