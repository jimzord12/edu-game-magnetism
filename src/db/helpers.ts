import { SQLocal } from 'sqlocal';

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
