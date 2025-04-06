import type { SQLocal } from 'sqlocal';

// Vite will bundle all .sql files as raw strings
// const migrationModules = import.meta.glob('../../drizzle/migrations/*.sql', {
//   as: 'raw',
//   eager: true,
// });

type SQLocal_Runner = SQLocal['sql'];

export async function runMigrations(sql: SQLocal_Runner) {
  await createTables(sql);
}

async function createTables(sql: SQLocal_Runner) {
  // Create players table
  console.log('📅 CREATING SQLite TABLES 📅');
  console.log('');

  console.log('🔃 Creating players table...');
  await sql`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      games_played INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      last_game_date INTEGER
    );
  `;
  console.log('✅ Created players table!');
  console.log('');

  // Create games table
  console.log('🔃 Creating games table...');
  await sql`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sub_category TEXT NOT NULL,
      avg_score REAL NOT NULL
    );
  `;
  console.log('✅ Created games table!');
  console.log('');

  // Create game_sessions table with foreign keys
  console.log('🔃 Creating game_sessions table...');
  await sql`
    CREATE TABLE IF NOT EXISTS game_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      game_id INTEGER,
      player_id INTEGER,
      started_at INTEGER NOT NULL,
      ended_at INTEGER,
      score REAL NOT NULL,
      FOREIGN KEY (game_id) REFERENCES games(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
      FOREIGN KEY (player_id) REFERENCES players(id) ON UPDATE NO ACTION ON DELETE NO ACTION
    );
  `;
  console.log('✅ Created game_sessions table!');
  console.log('');
}
