import { eq } from 'drizzle-orm';
import { schema } from '../schema';
import { DrizzleDB, DrizzleTestDB, NewGame } from '../types';

export class GameService {
  private db: DrizzleDB | DrizzleTestDB;

  constructor(drizzleDbInstance: DrizzleDB | DrizzleTestDB) {
    this.db = drizzleDbInstance;
  }

  /**
   * Creates a new game record.
   * @param gameData - Object containing game details (name, category, subCategory, avgScore).
   * @returns The newly created game object.
   */
  async createGame(gameData: Omit<NewGame, 'id'>) {
    const result = await this.db
      .insert(schema.games)
      .values(gameData)
      .returning();
    return result[0];
  }

  /**
   * Updates the average score for a specific game.
   * @param gameId - The ID of the game to update.
   * @param newAvgScore - The new average score (float/real).
   * @returns The updated game object or undefined if game not found.
   */
  async updateAvgScore(gameId: number, newAvgScore: number) {
    const result = await this.db
      .update(schema.games)
      .set({ avgScore: newAvgScore })
      .where(eq(schema.games.id, gameId))
      .returning();
    return result[0];
  }

  /**
   * Retrieves a game by its unique ID.
   * @param id - The ID of the game to retrieve.
   * @returns The game object or undefined if not found.
   */
  async getGameById(id: number) {
    const result = await this.db
      .select()
      .from(schema.games)
      .where(eq(schema.games.id, id))
      .limit(1);
    return result[0];
  }

  /**
   * Retrieves all games from the database.
   * @returns An array of all game objects.
   */
  async getAllGames() {
    return await this.db.select().from(schema.games);
  }
}
