import { SQLocal } from 'sqlocal';

// Create a client with a name for the SQLite file to save in
// the origin private file system
const { sql } = new SQLocal('database.sqlite3');

await sql`DROP TABLE IF EXISTS game_sessions`;

// Use the "sql" tagged template to execute a SQL statement
// against the SQLite database
await sql`CREATE TABLE game_sessions (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	game_id integer,
	player_id integer,
	started_at integer NOT NULL,
	ended_at integer,
	score real NOT NULL
);`;

// Execute a parameterized statement just by inserting
// parameters in the SQL string
const gameSession_1 = {
  game_id: 1,
  player_id: 1,
  started_at: 1688000000,
  ended_at: 1688000000,
  score: 100,
};
const gameSession_2 = {
  game_id: 2,
  player_id: 2,
  started_at: 1685000000,
  ended_at: 1685000000,
  score: 200,
};
const gameSessions = [gameSession_1, gameSession_2];
for (const gs of gameSessions) {
  await sql`
      INSERT INTO game_sessions (game_id, player_id, started_at, ended_at, score)
      VALUES (${gs.game_id}, ${gs.player_id}, ${gs.started_at}, ${gs.ended_at}, ${gs.score});
    `;
}

// SELECT queries and queries with the RETURNING clause will
// return the matched records as an array of objects
const data = await sql`SELECT * FROM game_sessions`;
console.log(data);
