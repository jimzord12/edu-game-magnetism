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

## 💡 Why This Matters

- [x] Encourages kids to take ownership of their progress
- [x] Enables personalized game data (scores, attempts, progress)
- [ ] Prepares the app for future leaderboard and PDF report features

## 🆕 Future Improvements

- [ ] Add profile pictures support
- [ ] Implement account recovery mechanism
- [ ] Add parental controls
- [ ] Implement data export/backup feature
- [ ] Add player statistics dashboard

## For Later but Do Not Forget

Game & GameSession Services are implemented but NOT used yet!
