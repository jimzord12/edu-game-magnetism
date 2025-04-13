import { eq, desc } from 'drizzle-orm';
import { quizScores, schema } from '../schema';
import { DrizzleDB } from '../types';
import { getAverage } from '../../utils/helpers';

export class QuizService {
  private db: DrizzleDB;

  constructor(drizzleDbInstance: DrizzleDB) {
    this.db = drizzleDbInstance;
  }

  /**
   * Creates a new quiz score record.
   * @param playerId - The ID of the player
   * @param score - The quiz score
   * @returns The newly created quiz score object
   */
  async createQuizScore(playerId: number, score: number) {
    const result = await this.db
      .insert(schema.quizScores)
      .values({
        playerId,
        score,
        date: new Date(),
      })
      .returning();
    return result[0];
  }

  /**
   * Retrieves all quiz scores for a specific player
   * @param playerId - The ID of the player
   * @returns Array of quiz score objects
   */
  async getPlayerQuizScores(playerId: number) {
    return await this.db
      .select()
      .from(schema.quizScores)
      .where(eq(schema.quizScores.playerId, playerId))
      .orderBy(desc(schema.quizScores.date));
  }

  /**
   * Retrieves top quiz scores with player names
   * @param limit - Maximum number of scores to return
   * @returns Array of quiz score objects with player names
   */
  async getHighScores(limit: number = 10) {
    return await this.db
      .select()
      .from(schema.quizScores)
      .innerJoin(
        schema.players,
        eq(schema.players.id, schema.quizScores.playerId)
      )
      .orderBy(desc(schema.quizScores.score))
      .limit(limit);
  }

  /**
   * Calculates the average score for a player
   * @param playerId - The ID of the player
   * @returns The average score or 0 if no scores exist
   */
  async getAverageScore(playerId: number) {
    const scores = await this.db
      .select({
        score: quizScores.score,
      })
      .from(schema.quizScores)
      .where(eq(schema.quizScores.playerId, playerId))
      .orderBy(desc(schema.quizScores.date));

    if (scores.length === 0) return 0;

    const numberScores = scores.map((s) => s.score);
    const averageScore = getAverage(numberScores);
    return averageScore;
  }
}
