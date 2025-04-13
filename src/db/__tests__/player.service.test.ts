// src/services/player.service.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PlayerService } from '../services/player.service.for-tests';
import { GenericSQLiteInstance } from '../types';
import { setupTestDb } from './test-setup';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let db: GenericSQLiteInstance<'sync'>;
  let cleanup: () => Promise<void>;
  let close: () => void;

  beforeAll(() => {
    const { testDB, cleanupDb, closeDb } = setupTestDb();
    db = testDB;
    cleanup = cleanupDb;
    close = closeDb;
  });

  beforeEach(async () => {
    await cleanup(); // Clean DB before each test
    playerService = new PlayerService(db); // Create fresh service instance
  });

  afterAll(() => {
    close(); // Close DB connection after all tests
  });

  it('should create a new player and return it', async () => {
    const playerData = { name: 'Alice', age: 30, gamesPlayed: 0 };
    const createdPlayer = await playerService.createPlayer(playerData);

    expect(createdPlayer).toBeDefined();
    expect(createdPlayer.id).toBeTypeOf('number');
    expect(createdPlayer.name).toBe(playerData.name);
    expect(createdPlayer.age).toBe(playerData.age);
    expect(createdPlayer.gamesPlayed).toBe(0);
    expect(createdPlayer.createdAt).toBeInstanceOf(Date);
    expect(createdPlayer.lastGameDate).toBeNull(); // Default if not provided
  });

  it('should get a player by ID', async () => {
    const p1 = await playerService.createPlayer({
      name: 'Bob',
      age: 25,
      gamesPlayed: 5,
    });
    const fetchedPlayer = await playerService.getPlayerById(p1.id);

    expect(fetchedPlayer).toBeDefined();
    expect(fetchedPlayer?.id).toBe(p1.id);
    expect(fetchedPlayer?.name).toBe('Bob');
  });

  it('should return undefined when getting a non-existent player ID', async () => {
    const fetchedPlayer = await playerService.getPlayerById(9999);
    expect(fetchedPlayer).toBeUndefined();
  });

  it('should get all players', async () => {
    await playerService.createPlayer({
      name: 'Charlie',
      age: 40,
      gamesPlayed: 10,
    });
    await playerService.createPlayer({
      name: 'Diana',
      age: 35,
      gamesPlayed: 2,
    });

    const allPlayers = await playerService.getAllPlayers();
    expect(allPlayers).toHaveLength(2);
    expect(allPlayers.map((p) => p.name)).toEqual(
      expect.arrayContaining(['Charlie', 'Diana'])
    );
  });

  it('should return an empty array when getting all players from an empty table', async () => {
    const allPlayers = await playerService.getAllPlayers();
    expect(allPlayers).toEqual([]);
  });

  it('should increment gamesPlayed for a player', async () => {
    const player = await playerService.createPlayer({
      name: 'Eve',
      age: 28,
      gamesPlayed: 3,
    });
    const updatedPlayer = await playerService.incrementGamesPlayed(
      player.id,
      2
    );

    expect(updatedPlayer).toBeDefined();
    expect(updatedPlayer?.gamesPlayed).toBe(5);

    // Verify by fetching again
    const fetchedPlayer = await playerService.getPlayerById(player.id);
    expect(fetchedPlayer?.gamesPlayed).toBe(5);
  });

  it('should update lastGameDate for a player', async () => {
    const player = await playerService.createPlayer({
      name: 'Frank',
      age: 50,
      gamesPlayed: 1,
    });
    const newDate = new Date(2024, 5, 15); // June 15, 2024
    const updatedPlayer = await playerService.updateLastGameDate(
      player.id,
      newDate
    );

    expect(updatedPlayer).toBeDefined();
    // Compare timestamps as Date objects might differ slightly in ms
    expect(updatedPlayer?.lastGameDate?.getTime()).toBe(newDate.getTime());

    // Verify by fetching again
    const fetchedPlayer = await playerService.getPlayerById(player.id);
    expect(fetchedPlayer?.lastGameDate?.getTime()).toBe(newDate.getTime());
  });

  it('should use current date if no date provided for updateLastGameDate', async () => {
    const player = await playerService.createPlayer({
      name: 'Grace',
      age: 22,
      gamesPlayed: 0,
    });

    // Round to seconds (multiply by 1000 to convert seconds to milliseconds)
    const beforeUpdate = Math.floor(Date.now() / 1000) * 1000;
    const updatedPlayer = await playerService.updateLastGameDate(player.id);
    const afterUpdate = Math.ceil(Date.now() / 1000) * 1000;

    expect(updatedPlayer).toBeDefined();
    expect(updatedPlayer?.lastGameDate).toBeInstanceOf(Date);
    expect(updatedPlayer!.lastGameDate!.getTime()).toBeGreaterThanOrEqual(
      beforeUpdate
    );
    expect(updatedPlayer!.lastGameDate!.getTime()).toBeLessThanOrEqual(
      afterUpdate
    );
  });

  it('should delete a player by ID', async () => {
    const player = await playerService.createPlayer({
      name: 'Heidi',
      age: 33,
      gamesPlayed: 7,
    });
    const deleteResult = await playerService.deletePlayerById(player.id);

    expect(deleteResult).toBeDefined();
    expect(deleteResult?.deletedId).toBe(player.id);

    // Verify deletion
    const fetchedPlayer = await playerService.getPlayerById(player.id);
    expect(fetchedPlayer).toBeUndefined();
  });

  it('should return undefined when deleting a non-existent player ID', async () => {
    const deleteResult = await playerService.deletePlayerById(9999);
    expect(deleteResult).toBeUndefined();
  });

  it('should prevent duplicate usernames', async () => {
    await playerService.createPlayer({
      name: 'UniqueUser',
      age: 25,
      gamesPlayed: 0,
    });

    // Attempt to create another player with the same username
    await expect(
      playerService.createPlayer({
        name: 'UniqueUser',
        age: 30,
        gamesPlayed: 0,
      })
    ).rejects.toThrow(); // Should throw due to unique constraint
  });

  it('should get a player by username', async () => {
    const playerData = {
      name: 'TestUser',
      age: 20,
      gamesPlayed: 0,
    };
    await playerService.createPlayer(playerData);

    const fetchedPlayer = await playerService.getPlayerByUsername('TestUser');
    expect(fetchedPlayer).toBeDefined();
    expect(fetchedPlayer?.name).toBe('TestUser');
  });

  it('should return undefined for non-existent username', async () => {
    const player = await playerService.getPlayerByUsername('NonExistentUser');
    expect(player).toBeUndefined();
  });
});
