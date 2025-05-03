# TODO Tasks

## General

## Features

## ✅ TODO: Player Management Feature

### 🎯 Goal

Implement a simple player account system to:

- [x] Allow kids to create and manage accounts (username only, no passwords)
- [x] Track who is playing for scorekeeping, progress reports, and leaderboards
- [ ] Enable per-player game data storage and future PDF reporting

---

## 🔧 Tasks Overview

### ✅ Database & ORM

- [x] Define player table schema using **Drizzle ORM**
- [x] Generate migrations using **Drizzle Kit**
- [x] Use **SQLocal's `sql` template** to create tables in **SQLite**
- [x] Add unique constraint for player names

### ✅ Player Services

- [x] Create service functions to:
  - [x] Fetch all players from the DB
  - [x] Create a new player
  - [x] Delete an existing player
  - [x] Add proper unique constraint handling
  - [x] Add error handling for database operations

### ✅ Redux Slice: `playerSlice`

Manage player authentication with Redux Toolkit. Include the following actions:

| Action         | Status | Purpose                                |
| -------------- | ------ | -------------------------------------- |
| `logPlayerIn`  | ✅     | Set the active player                  |
| `logPlayerOut` | ✅     | Clear the logged-in player             |
| `togglePlayer` | ⏳     | Switch to a different player           |
| `createPlayer` | ✅     | Add a new player to the database       |
| `getPlayer`    | ✅     | Get the current player                 |
| `isLoggedIn`   | ✅     | Check if a player is logged in         |
| `isLoggedOut`  | ✅     | Check if no player is logged in        |
| `deletePlayer` | ⏳     | Remove a player from the database      |
| `fetchPlayers` | ⏳     | Retrieve all players from the database |
| `clearError`   | ✅     | Clear any error state                  |

### ✅ React Hook: `useAuth`

Create a custom hook that wraps `playerSlice` logic. It should expose all Redux actions as hook methods:

- [x] `logPlayerIn`, `logPlayerOut`
- [x] `createPlayer`, `getPlayer`
- [x] `isLoggedIn`, `isLoggedOut`
- [ ] `deletePlayer`, `fetchPlayers`
- [x] Local storage synchronization
- [x] Error state management
- [ ] Support for player switching

### 🆕 Storage Sync & Error Handling

- [x] Implement `useLocalStorage` hook
- [x] Add localStorage sync on app initialization
- [x] Improve error handling for duplicate usernames
- [x] Add error state cleanup
- [ ] Add retry mechanism for failed storage operations
- [ ] Add storage quota management

### 🎮 Game Mechanics

- [x] Display the time that the game/simulation has been running for the current player.
- [ ] Magnets require a couple of behavioral enhancements:
  - [x] Magnets should be able to be placed on the game canvas and then moved around.
  - [x] Magnets should be able to be removed from the game canvas.
  - [x] Magnets should have a default size and shape.
  - [x] Magnets should have a default color, depending on their polarity.
  - [ ] Magnets should have a default strength, but can be strengthened or weakened by the player.
  - [ ] Magnets should NOT be able to be dragged when the game is at "playing" state.
  - [x] Magnets should have a default polarity, but can be reversed by the player.
  - [x] Magnets should have a default position, but can be moved by the player.
  - [ ] Magnets should have the ability to have their movement restricted to either horizontal or vertical.
  - [x] The Magnet placement and the Magnet dragging should be done in a way that one is not interfering with another. Basically, you cannot place and drag a Magnet at the same time.
- [x] When the game is paused, the player should be able to see the current state of the game, including the position of all magnets and their strengths.
- [x] When the player has won or lost the game,
  - [x] the game should display a message indicating the outcome of the game.
  - [x] The game should stop updating the game engine.
- [x] We need the ability to make level entities, like walls, hazards, magnets, etc. to be move on a specific repeated fashion.

### 🧹 Chores & Tasks

- [x] Create a Magnets' GameEngine Variant
- [x] Create upgrade the current useGameEngine Hook in Magnets feature to support the new GameEngine variant.
- [ ] Make Levels be able to have their own Gravity.

---

## 🧪 Behavior Flow (UI Logic)

### On App Start:

1. [x] Check if the database exists:
   - [x] If **no DB** or **DB exists but has no players** → Show **"Create Account"** button
2. [x] If players exist but **no one is logged in** → Show **"Login"** button
   - [ ] Clicking opens a modal with a list of players to choose from

### When a Player Logs In:

- [x] Replace home screen button with **"Start Your Adventure"**
- [ ] Show a **profile component** in the top-right corner:
  - [ ] Displays player icon and username
  - [ ] Clicking reveals a dropdown with:
    - [ ] Log Out
    - [ ] Change Player
    - [ ] Delete Player

---

## Deployment

- [ ] Create a new branch for the final version of the app
- [ ] Build and preview the app using **Electron** and **Vite**
- [ ] Review and merge the player management feature branch

---

## 💡 Why This Matters

- [x] Encourages kids to take ownership of their progress
- [x] Enables personalized game data (scores, attempts, progress)
- [ ] Prepares the app for future leaderboard and PDF report features

---

## 🆕 Future Improvements

- [ ] Add profile pictures support
- [ ] Implement account recovery mechanism
- [ ] Add parental controls
- [ ] Implement data export/backup feature
- [ ] Add player statistics dashboard
