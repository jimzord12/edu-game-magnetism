# 📚 Developer Manual – Educational Magnetism Puzzle Game

**Version:** 1.0  
**Last updated:** May 3, 2025

---

## 1. Project Overview

The Educational Magnetism Puzzle Game is a modern, browser-based educational game that teaches magnetism and electromagnetism through interactive puzzles, quizzes, and a sandbox mode. Players manipulate magnetic fields to guide a ball to a target, experiment with different magnet types, and test their knowledge with a built-in quiz.

- **Frontend:** React 19, TypeScript, Vite 6
- **Physics:** Matter.js (custom magnetic force logic)
- **Rendering:** p5.js
- **State Management:** Redux Toolkit
- **Persistence:** SQLite via OPFS (Origin Private File System) in-browser, managed with SQLocal and Drizzle ORM
- **Testing:** Vitest, React Testing Library

---

## 2. Tech Stack & Tooling

| Layer            | Technology / Tool             | Purpose                                  |
| ---------------- | ----------------------------- | ---------------------------------------- |
| Language         | TypeScript 5.x                | Type-safe codebase                       |
| Frontend         | React 19 + Vite 6             | UI, routing, fast HMR, production builds |
| State Management | Redux Toolkit 2.x             | Global state, feature slices             |
| Physics Engine   | Matter.js                     | Physics simulation, collisions           |
| Rendering        | p5.js                         | Canvas rendering, field visualization    |
| Database         | SQLite (via SQLocal+Drizzle)  | Relational data in-browser               |
| Testing          | Vitest, React Testing Library | Unit/integration tests                   |
| Styling          | Tailwind CSS 4.x              | Utility-first CSS                        |
| CI/CD            | GitHub Actions                | Lint, test, deploy to GitHub Pages       |
| Lint/Format      | ESLint                        | Code quality                             |
| Readability      | Prettier                      | Code formatting                          |

## 3. Codebase Structure

The project uses a **feature-first architecture** for scalability and maintainability.

```
/src
│
├── /assets                # Static assets (images, quiz JSON, etc.)
├── /components            # Shared presentational components
├── /config                # Centralized configuration (gameConfig.ts, levels.ts)
├── /db
│   ├── client.ts          # DB initialization and helpers
│   ├── schema.ts          # Drizzle ORM schema definitions
│   ├── runMigrations.ts   # Migration runner (creates tables)
│   ├── types.ts           # DB types/interfaces
│   └── /services          # Service layer for DB access
│       ├── game.service.ts
│       ├── player.service.ts
│       └── gameSession.service.ts
├── /features
│   ├── /magnetGame        # Regular magnet gameplay
│   ├── /electroGame       # Electromagnet gameplay
│   ├── /player            # Player state management
│   ├── /level             # Level logic, components, hooks, types, utils
│   └── /sandbox           # Sandbox mode
├── /hooks                 # Reusable custom hooks (useDB, useLocalStorage, etc.)
├── /models                # Game models (Ball, Magnet, ElectroMagnet, Wall, Point)
├── /pages                 # Route components (LevelSelectPage, LoadingPage, etc.)
├── /router                # App routing (index.ts)
├── /store                 # Redux store (rootReducer.ts)
└── main.tsx               # App entry point
```

- **Quiz data** is stored in `/src/assets/magnetism_electromagnetism_quiz.json`.
- All features are self-contained with their own components, hooks, slices, and types.

---

## 4. Feature Development Walk-through

### 4.1 Magnetism Puzzle Game

- **Game Objects:** Ball, Magnet, ElectroMagnet, Wall, Point (see `/models`)
- **Physics:** Matter.js for collisions, custom logic for magnetic forces and field falloff
- **Game Loop:** Managed by feature-specific hooks (`useGameEngineMagnet`, `useSandboxEngine`)
- **UI:** React components render the game canvas using p5.js
- **State:** Redux slices (`magnetGameSlice`, `electroGameSlice`, etc.) manage game state and actions

**Development Steps:**

1. Define level and game configuration in `/config/levels.ts` and `/config/gameConfig.ts`.
2. Implement or update models in `/models/`.
3. Add or update Redux slices in `/features/*/slices/`.
4. Use custom hooks for engine logic and React integration.
5. Test new mechanics in the sandbox mode or via unit tests.

### 4.2 Quiz Module

- **Quiz Data:** Stored as JSON in `/src/assets/magnetism_electromagnetism_quiz.json`
- **Service Layer:** `/db/services/quiz.service.ts` handles quiz score persistence using Drizzle ORM
- **UI:** Quiz components display questions, options, and results
- **State:** Redux slice manages quiz state and user progress

**Development Steps:**

1. Add new questions to the quiz JSON file.
2. Update quiz logic or UI in the relevant feature directory.
3. Use the quiz service for score tracking and persistence.

### 4.3 Sandbox Physics Playground

- **Purpose:** Free experimentation with magnets, balls, and fields
- **Engine:** Managed by `useSandboxEngine` hook
- **UI:** Drag-and-drop placement of objects, real-time field visualization
- **Persistence:** No export/import or dnd-kit; state is not serializable to JSON

**Development Steps:**

1. Extend `/features/sandbox/` for new sandbox features.
2. Use p5.js for rendering and Matter.js for physics.
3. Add new object types or interactions as needed.

---

## 5. Installation & Local Setup

### Prerequisites

- Node.js v18 or higher
- npm (<i>also works with bun and deno</i>)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/jimzord12/edu-game-magnetism.git
cd edu-game-magnetism

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. Open your browser at http://localhost:5173
```

### Database Setup

- The SQLite database is created automatically in the browser using SQLocal and Drizzle ORM.
- Migrations are run on app startup via `src/db/runMigrations.ts`.
- To generate new migrations (after schema changes):
  ```bash
  npm run gen:migrations
  ```

---

## 6. Production Build & Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to GitHub Pages

- Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`).
- The `deploy` script uses `gh-pages` to publish the `dist/` directory.

---

## 7. Difficulties Faced & Solutions

### 7.1 Bundling Issues with SQLocal

- **Problem:** Vite+Rollup cannot bundle IIFE/UMD workers (used by SQLocal) with code-splitting.
- **Solution:** Mark `sqlocal` as external in `vite.config.ts` and use dynamic import via CDN or local copy. See `/my-documentation/BUGS.md` for detailed steps.

### 7.2 Path Aliases

- **Problem:** Incorrect placement of `resolve.alias` in `vite.config.ts` caused import failures.
- **Solution:** Ensure `resolve.alias` is at the top level of the config.

### 7.3 TypeScript & Drizzle ORM

- **Problem:** Type conflicts when using union types for DB instances.
- **Solution:** Use Drizzle’s `BaseSQLiteDatabase` interface for type safety.

### 7.4 Physics Integration

- **Problem:** Synchronizing p5.js rendering and Matter.js physics with React’s lifecycle.
- **Solution:** Encapsulate engine logic in custom hooks and classes, manage lifecycles with `useEffect` and `useRef`.

### 7.5 Player & Quiz Data Sync

- **Problem:** Ensuring player and quiz data is consistent between LocalStorage and SQLite.
- **Solution:** Use custom hooks (`useLocalStorage`, `useDB`) and Redux actions for synchronization.

---

## 8. Current Bugs & Known Issues

This section tracks known bugs and areas needing improvement:

### Gameplay Bugs:

- **Issue #1 (Magnet Reset):** When the game restarts (e.g., after losing or manually resetting), the initial default magnets for the level are not correctly reset or re-added to the simulation. **Workaround:** Refresh the entire page.
- **Issue #2 / #5 (Moving Wall Reset):** Moving walls do not reset to their initial positions or state when the player loses or resets the game.
- **Issue #4 (Moving Wall Drift):** Moving walls might receive multiple update calls per frame under certain conditions, causing their compound bodies to drift unexpectedly. Requires ensuring only a single update call per frame.
- **Issue #6 (Moving Wall Type Safety):** The implementation for moving walls could benefit from stricter TypeScript type guards for more robust and maintainable code.

### Build/Dependency Issues:

- **`sqlocal` Build:** While a workaround (dynamic import) is in place, the underlying issue is that `sqlocal` doesn't ship a modern ES-module build, which is less ideal for long-term maintenance compared to libraries with native ES module support.

_(Note: Issue #3 regarding inconsistent moving wall patterns was solved by using a static origin point instead of dynamic body position.)_

---

## 9. Contributing

- See [`CONTRIBUTING.md`](CONTRIBUTING.md) for detailed guidelines.
- Use feature-first folder structure.
- Write TypeScript, prefer Redux Toolkit slices, and use custom hooks for logic reuse.
- Follow conventional commit messages (e.g., `feat:`, `fix:`, `refactor:`).
- Add unit and integration tests for new features.

---

## 10. Appendix

### 10.1 Database Schema (Excerpt)

The database stores information about players, the available games, individual game sessions played by users, and their quiz scores. Key relationships include:

- A `Player` can have multiple `Game Sessions` and `Quiz Scores`.
- A `Game Session` belongs to one `Game` and one `Player`.

```sql
-- Players Table: Stores information about registered players.
TABLE Players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  age INTEGER NOT NULL,
  games_played INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL, -- Unix timestamp
  last_game_date INTEGER        -- Unix timestamp
);

-- Games Table: Defines the available games within the application.
TABLE Games (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,      -- e.g., 'Magnetism', 'Electromagnetism'
  sub_category TEXT NOT NULL,  -- e.g., 'Level', 'Quiz'
  avg_score REAL NOT NULL DEFAULT 0.0
);

-- Game Sessions Table: Tracks individual gameplay sessions.
TABLE Game_Sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER,             -- Foreign Key -> Games(id)
  player_id INTEGER,           -- Foreign Key -> Players(id)
  started_at INTEGER NOT NULL, -- Unix timestamp
  ended_at INTEGER,            -- Unix timestamp
  score REAL NOT NULL DEFAULT 0.0,
  FOREIGN KEY (game_id) REFERENCES Games(id),
  FOREIGN KEY (player_id) REFERENCES Players(id)
);

-- Quiz Scores Table: Stores scores achieved by players in quizzes.
TABLE Quiz_Scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER,           -- Foreign Key -> Players(id)
  score INTEGER NOT NULL,
  date INTEGER NOT NULL,       -- Unix timestamp
  FOREIGN KEY (player_id) REFERENCES Players(id)
);
```

### 10.2 Environment Variables

The following environment variables are used in the project:

```
GITHUB_USERNAME=<your-github-username>
GITHUB_REPO_NAME=<your-repo-name>

# SQLocal
VITE_STORAGE_KEY=executed_migrations
```

---

## 11. Further Reading

- [Matter.js Documentation](https://brm.io/matter-js/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [p5.js Reference](https://p5js.org/reference/)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Enjoy building and learning with the Educational Magnetism Puzzle Game!**
