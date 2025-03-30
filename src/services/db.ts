import Dexie, { Table } from 'dexie';
import { ILevelData } from '../features/game/types';

// Define interfaces for your data structures stored in Dexie
// These might mirror or extend types from your features/types

export interface IPlayerProfile {
  id?: number; // Auto-incremented primary key
  name: string;
  lastPlayedLevelId?: string;
  // Add other player settings/info
}

export interface ILevelProgress {
  levelId: string; // Primary key (use level ID from config/game)
  completed: boolean;
  bestTime?: number; // Example metric
  stars?: number; // Example metric
}

export interface IStoredLevelData {
  // If storing level designs in DB eventually
  id: string; // Primary key
  name: string;
  data: string; // Store level layout as JSON string or structured data
}

// Define the Database class
export class MagnetMazeDB extends Dexie {
  // Declare tables
  playerProfile!: Table<IPlayerProfile, number>;
  levelProgress!: Table<ILevelProgress, string>;
  // storedLevels!: Table<IStoredLevelData, string>; // If needed later

  constructor() {
    super('MagnetMazeDB'); // Database name

    // Define database schema (versions)
    this.version(1).stores({
      // Define tables and indexes
      // '++id' means auto-incremented primary key
      // 'levelId' means primary key is the levelId property
      playerProfile: '++id, name',
      levelProgress: 'levelId, completed', // index on 'completed' might be useful
      // storedLevels: 'id',
    });

    // Add more versions here if schema changes in the future
    // this.version(2).stores({ ... }).upgrade(...)
  }
}

// Create a singleton instance of the database
export const db = new MagnetMazeDB();

// --- Example Interaction Functions ---

// These could live here or in dedicated service files (e.g., levelService.ts)

export const getPlayerProfile = async (): Promise<
  IPlayerProfile | undefined
> => {
  // Assuming only one profile for simplicity
  return await db.playerProfile.toCollection().first();
};

export const savePlayerProfile = async (
  profile: IPlayerProfile
): Promise<number> => {
  return await db.playerProfile.put(profile); // put handles insert or update
};

export const getLevelProgress = async (
  levelId: string
): Promise<ILevelProgress | undefined> => {
  return await db.levelProgress.get(levelId);
};

export const saveLevelProgress = async (
  progress: ILevelProgress
): Promise<string> => {
  return await db.levelProgress.put(progress);
};

export const getAllLevelProgress = async (): Promise<ILevelProgress[]> => {
  return await db.levelProgress.toArray();
};

// Function to potentially populate DB with initial levels from config
export const initializeDatabase = async (defaultLevels: ILevelData[]) => {
  const count = await db.levelProgress.count();
  if (count === 0) {
    console.log('Initializing level progress in DB...');
    const initialProgress = defaultLevels.map((level) => ({
      levelId: level.id,
      completed: false,
    }));
    await db.levelProgress.bulkAdd(initialProgress);
  }
  // Initialize player profile if needed
  const profile = await getPlayerProfile();
  if (!profile) {
    await savePlayerProfile({ name: 'Player 1' });
  }
};
