import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Players table
export const players = sqliteTable('players', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(), // Added unique constraint
  age: integer('age').notNull(),
  gamesPlayed: integer('games_played').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  lastGameDate: integer('last_game_date', { mode: 'timestamp' }),
});

// Games table
export const games = sqliteTable('games', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  subCategory: text('sub_category').notNull(),
  avgScore: real('avg_score').notNull(),
});

// Game sessions table
export const gameSessions = sqliteTable('game_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gameId: integer('game_id').references(() => games.id),
  playerId: integer('player_id').references(() => players.id),
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  endedAt: integer('ended_at', { mode: 'timestamp' }),
  score: real('score').notNull(),
});

// Quiz scores table
export const quizScores = sqliteTable('quiz_scores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  playerId: integer('player_id').references(() => players.id),
  score: integer('score').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
});

// Define relationships
export const playersRelations = relations(players, ({ many }) => ({
  gameSessions: many(gameSessions),
  quizScores: many(quizScores),
}));

export const gamesRelations = relations(games, ({ many }) => ({
  gameSessions: many(gameSessions),
}));

export const gameSessionsRelations = relations(gameSessions, ({ one }) => ({
  player: one(players, {
    fields: [gameSessions.playerId],
    references: [players.id],
  }),
  game: one(games, {
    fields: [gameSessions.gameId],
    references: [games.id],
  }),
}));

export const quizScoresRelations = relations(quizScores, ({ one }) => ({
  player: one(players, {
    fields: [quizScores.playerId],
    references: [players.id],
  }),
}));

export const schema = {
  players,
  games,
  gameSessions,
  quizScores,
};
