// player.service.ts
import { eq, sql } from 'drizzle-orm';
import { GenericSQLiteInstance, NewPlayer } from '../types';
import { schema } from '../schema';

export class PlayerService {
  private db: GenericSQLiteInstance;

  constructor(drizzleDbInstance: GenericSQLiteInstance) {
    this.db = drizzleDbInstance;
  }

  /**
   * Creates a new player record.
   * @param playerData - Object containing player details (name, age, gamesPlayed). createdAt is handled automatically if default is set, otherwise include it.
   * @returns The newly created player object.
   */
  async createPlayer(
    playerData: Omit<NewPlayer, 'id' | 'createdAt' | 'lastGameDate'> & {
      createdAt?: Date;
      lastGameDate?: Date | null;
    }
  ) {
    // Ensure createdAt is set if not automatically handled by DB default
    const dataToInsert: NewPlayer = {
      ...playerData,
      createdAt: playerData.createdAt || new Date(), // Use provided or set new Date
      lastGameDate:
        playerData.lastGameDate === undefined ? null : playerData.lastGameDate, // Handle optional lastGameDate explicitly
    };

    const result = await this.db
      .insert(schema.players)
      .values(dataToInsert)
      .returning();
    return result[0]; // .returning() returns an array
  }

  /**
   * Retrieves a player by their unique ID.
   * @param id - The ID of the player to retrieve.
   * @returns The player object or undefined if not found.
   */
  async getPlayerById(id: number) {
    const result = await this.db
      .select()
      .from(schema.players)
      .where(eq(schema.players.id, id))
      .limit(1);
    return result[0]; // Returns the player object or undefined
  }

  /**
   * Retrieves all players from the database.
   * @returns An array of all player objects.
   */
  async getAllPlayers() {
    return await this.db.select().from(schema.players);
  }

  /**
   * Increments the gamesPlayed count for a specific player.
   * @param playerId - The ID of the player to update.
   * @param incrementBy - The number to add to the current gamesPlayed count (defaults to 1).
   * @returns The updated player object or undefined if player not found.
   */
  async incrementGamesPlayed(playerId: number, incrementBy: number = 1) {
    // Use sql tagged template for arithmetic operations
    const result = await this.db
      .update(schema.players)
      .set({ gamesPlayed: sql`${schema.players.gamesPlayed} + ${incrementBy}` })
      .where(eq(schema.players.id, playerId))
      .returning();
    return result[0];
  }

  /**
   * Updates the last game date for a specific player.
   * @param playerId - The ID of the player to update.
   * @param date - The new Date object for the last game. Defaults to the current time.
   * @returns The updated player object or undefined if player not found.
   */
  async updateLastGameDate(playerId: number, date: Date = new Date()) {
    const result = await this.db
      .update(schema.players)
      .set({ lastGameDate: date })
      .where(eq(schema.players.id, playerId))
      .returning();
    return result[0];
  }

  /**
   * Deletes a player by their unique ID.
   * IMPORTANT: Consider implications of foreign key constraints on gameSessions.
   * You might want cascading deletes in SQL or handle orphaned sessions here.
   * @param id - The ID of the player to delete.
   * @returns An object containing the ID of the deleted player, or undefined if not found.
   */
  async deletePlayerById(id: number) {
    // Check related sessions or rely on DB constraints (e.g., ON DELETE CASCADE/SET NULL)
    // If not handled by DB, you might need to delete related gameSessions first.
    const result = await this.db
      .delete(schema.players)
      .where(eq(schema.players.id, id))
      .returning({ deletedId: schema.players.id });
    return result[0];
  }
}
