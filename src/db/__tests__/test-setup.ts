// src/db/test-setup.ts
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import fs from 'node:fs';
import path from 'node:path';
import { schema } from '../schema';

// Function to find the latest SQL migration file
function getLatestMigrationFile(migrationsFolder: string): string | null {
  try {
    const files = fs
      .readdirSync(migrationsFolder)
      .filter((file) => file.endsWith('.sql'))
      .sort() // Sort alphabetically/numerically
      .reverse(); // Get the latest first
    return files.length > 0 ? path.join(migrationsFolder, files[0]) : null;
  } catch (e) {
    console.error('Error reading migrations folder:', e);
    return null;
  }
}

export function setupTestDb() {
  // 1. Create in-memory SQLite DB
  const sqlite = new Database(':memory:');

  // 2. Create Drizzle instance with schema
  const testDB = drizzle(sqlite, { schema, logger: false }); // logger: true for debugging SQL

  // 3. Apply migrations (using migrate function is often easier if setup)
  // Option A: Using drizzle-orm/migrator (Recommended)
  const migrationsFolder = path.resolve(process.cwd(), './drizzle/migrations'); // Adjust if your folder is elsewhere
  console.log(`Applying migrations from: ${migrationsFolder}`);
  try {
    // Ensure the migration folder exists before calling migrate
    if (fs.existsSync(migrationsFolder)) {
      migrate(testDB, { migrationsFolder });
      console.log(
        'Migrations applied successfully using drizzle-orm/migrator.'
      );
    } else {
      console.warn(
        `Migrations folder not found at ${migrationsFolder}. Skipping migrations.`
      );
      // Optionally, fallback to manual execution if needed, or throw error
    }
  } catch (error) {
    console.error(
      'Error applying migrations with drizzle-orm/migrator:',
      error
    );
    // Fallback or re-throw as needed
    throw new Error('Migration failed');
  }

  // Function to close the DB connection
  const closeDb = () => {
    sqlite.close();
  };

  // Function to clean tables between tests
  const cleanupDb = async () => {
    // Order matters due to foreign keys! Delete sessions first.
    await testDB.delete(schema.gameSessions).execute();
    await testDB.delete(schema.games).execute();
    await testDB.delete(schema.players).execute();
  };

  return { testDB, closeDb, cleanupDb, getLatestMigrationFile };
}
