import { eq } from 'drizzle-orm';
import { schema } from '../schema';
import { DrizzleDB, DrizzleTestDB, NewGameSession } from '../types';

export class GameSessionService {
  private db: DrizzleDB | DrizzleTestDB;

  constructor(drizzleDbInstance: DrizzleDB | DrizzleTestDB) {
    this.db = drizzleDbInstance;
  }

  /**
   * Creates a new game session record.
   * Consider wrapping this and player updates in a transaction.
   * @param sessionData - Object containing session details (gameId, playerId, startedAt, score, endedAt - optional).
   * @returns The newly created game session object.
   */
  async createGameSession(
    sessionData: Omit<NewGameSession, 'id' | 'startedAt' | 'endedAt'> & {
      startedAt?: Date;
      endedAt?: Date | null;
    }
  ) {
    // Automatically set startedAt if not provided
    const dataToInsert: NewGameSession = {
      ...sessionData,
      startedAt: sessionData.startedAt || new Date(),
      endedAt: sessionData.endedAt === undefined ? null : sessionData.endedAt, // Handle optional endedAt explicitly
    };

    const result = await this.db
      .insert(schema.gameSessions)
      .values(dataToInsert)
      .returning();

    // --- Potential Enhancement ---
    // After creating the session, update the player's stats:
    // const playerService = new PlayerService(this.db); // Or inject if preferred
    // await playerService.incrementGamesPlayed(sessionData.playerId);
    // await playerService.updateLastGameDate(sessionData.playerId, dataToInsert.startedAt);
    // This should ideally happen within a database transaction for atomicity.

    return result[0];
  }

  /**
   * Retrieves all game sessions, potentially ordered by start time.
   * @returns An array of all game session objects.
   */
  async getAllGameSessions() {
    // Optionally add ordering, e.g., .orderBy(desc(schema.gameSessions.startedAt))
    return await this.db.select().from(schema.gameSessions);
  }

  /**
   * Retrieves a specific game session by its ID.
   * @param id - The ID of the game session to retrieve.
   * @returns The game session object or undefined if not found.
   */
  async getGameSessionById(id: number) {
    const result = await this.db
      .select()
      .from(schema.gameSessions)
      .where(eq(schema.gameSessions.id, id))
      .limit(1);
    return result[0];
  }

  /**
   * Retrieves game sessions for a specific player.
   * @param playerId - The ID of the player whose sessions to retrieve.
   * @returns An array of game session objects for the specified player.
   */
  async getSessionsByPlayerId(playerId: number) {
    return await this.db
      .select()
      .from(schema.gameSessions)
      .where(eq(schema.gameSessions.playerId, playerId));
    // Optionally add ordering
  }

  /**
   * Retrieves game sessions for a specific game.
   * @param gameId - The ID of the game whose sessions to retrieve.
   * @returns An array of game session objects for the specified game.
   */
  async getSessionsByGameId(gameId: number) {
    return await this.db
      .select()
      .from(schema.gameSessions)
      .where(eq(schema.gameSessions.gameId, gameId));
    // Optionally add ordering
  }

  /**
   * Example using Drizzle's relational queries to get a session with related player and game info.
   * Needs the main drizzle instance configured with the schema: `drizzle(driver, { schema })`.
   * @param sessionId - The ID of the session.
   * @returns The session object with nested player and game objects, or undefined.
   */
  async getGameSessionWithDetails(sessionId: number) {
    if (!this.db.query?.gameSessions) {
      console.warn(
        'Relational queries (db.query) might not be configured on this db instance.'
      );
      return undefined;
    }
    return await this.db.query.gameSessions.findFirst({
      where: eq(schema.gameSessions.id, sessionId),
      with: {
        player: true, // Uses the relation defined in schema.ts
        game: true, // Uses the relation defined in schema.ts
      },
    });
  }
}
