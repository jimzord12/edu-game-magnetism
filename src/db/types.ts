import { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { setupTestDb } from './__tests__/test-setup';
import { db } from './client';
import { schema } from './schema';

export type DBMode = 'async' | 'sync';

// Define a type alias for your specific Drizzle instance with the schema
export type DrizzleDB = typeof db;
export type DrizzleTestDB = ReturnType<typeof setupTestDb>['testDB'];
export type GenericSQLiteInstance<T extends DBMode> = BaseSQLiteDatabase<
  T extends 'async' ? 'async' : 'sync', // TResultKind: we're using async operations
  unknown, // TRunResult: default run result type
  typeof schema // TFullSchema: our schema type
  // typeof schema // TSchema: our schema type for relations
>;

// Helper types for creation methods (inferred from schema)
export type NewPlayer = typeof schema.players.$inferInsert;
export type NewGame = typeof schema.games.$inferInsert;
export type NewGameSession = typeof schema.gameSessions.$inferInsert;

export interface QuizScore {
  id: number;
  playerId: number;
  score: number;
  date: number;
  player_name?: string; // Optional field returned by JOIN queries
}
