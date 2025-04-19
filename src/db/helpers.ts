import { SQLocal } from 'sqlocal';
import { getDBFile, deleteDBFile } from './client';

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;

if (STORAGE_KEY === undefined) {
  throw new Error('VITE_STORAGE_KEY is not defined');
}

// Tell TypeScript this value is definitely a string
const STORAGE_KEY_VALUE = STORAGE_KEY as string;

export function getExecutedMigrations(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY_VALUE);
  return raw ? JSON.parse(raw) : [];
}

export function markMigrationAsExecuted(filename: string) {
  const list = getExecutedMigrations();
  const updated = [...list, filename];
  localStorage.setItem(STORAGE_KEY_VALUE, JSON.stringify(updated));
}

export async function _getTables(sql: SQLocal['sql']): Promise<string[]> {
  const result = await sql`
      SELECT name 
      FROM sqlite_master 
      WHERE type = 'table' AND name NOT LIKE 'sqlite_%';
    `;

  return result.map((row) => row.name);
}

/**
 * Exports the database to a downloadable file using the SQLocal getDatabaseFile method
 * @returns Promise that resolves when the export is complete
 */
export async function exportDatabase(): Promise<void> {
  try {
    const exportedFile = await getDBFile();
    const url = window.URL.createObjectURL(exportedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'magnetix-database.sqlite';
    a.click();
    window.URL.revokeObjectURL(url);
    console.log('Database exported successfully');
  } catch (error) {
    console.error('Failed to export database:', error);
    throw new Error('Failed to export database');
  }
}

/**
 * Deletes the database and runs migrations to recreate tables
 * This is useful for resetting the database during development
 * @returns Promise that resolves when the operation is complete
 */
export async function deleteDatabase(): Promise<void> {
  try {
    if (
      !confirm(
        'Are you sure you want to delete the database? This will remove all players, progress, and settings.'
      )
    ) {
      return;
    }

    // Clear all application localStorage items
    localStorage.removeItem(STORAGE_KEY_VALUE); // Clear migration tracking
    localStorage.removeItem('gamePlayers'); // Clear player list

    // For a complete reset, clear all application storage
    // This is an optional approach that clears everything
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith('magnetix-') ||
          key === 'gamePlayers' ||
          key === STORAGE_KEY_VALUE)
      ) {
        localStorage.removeItem(key);
      }
    }

    console.log('Local storage cleared');

    // The callback will run after database is deleted but before other clients can access it
    await deleteDBFile(async () => {
      console.log('Database deleted, tables will be recreated on next access');
      // After deletion, SQLocal will auto-initialize on next access
    });

    console.log('Database reset successfully');
    // Force reload the page to reset application state
    window.location.reload();
  } catch (error) {
    console.error('Failed to delete database:', error);
    throw new Error('Failed to delete database');
  }
}
