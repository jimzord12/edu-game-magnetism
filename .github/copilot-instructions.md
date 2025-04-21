# Project: Educational Magnetism Puzzle Game

Welcome to the **Educational Magnetism Puzzle Game**! 🎮🧲  
This document serves as a comprehensive guide for developers who want to contribute to the project.

---

## 🧠 Project Overview

This is a physics-based educational puzzle game where players manipulate magnetic fields to guide a ball to a target.

### Game Modes:

- **Regular Magnets:** Place attracting/repelling static magnets.
- **Electromagnets:** Control magnet strength dynamically for advanced puzzles.
- **Sandbox Mode:** Experiment freely with magnetism.

---

## 💠 Tech Stack

| Layer            | Technology    |
| ---------------- | ------------- |
| Language         | TypeScript    |
| Frontend         | React + Vite  |
| State Management | Redux Toolkit |
| Physics Engine   | Matter.js     |
| Rendering        | p5.js         |
| Routing          | React Router  |

---

## 📁 Project Structure (Feature-First Architecture)

```
/src
│
├── /components            # Shared presentational components
├── /config                # Centralized configuration
│   ├── gameConfig.ts
│   └── levels.ts
├── /db
│   └── /services          # Database service layer
│       ├── game.service.ts
│       ├── player.service.ts
│       └── gameSession.service.ts
├── /features
│   ├── /magnetGame        # Regular magnet gameplay
│   ├── /electroGame       # Electromagnet gameplay
│   ├── /player
│   └── /level
│       ├── components
│       ├── hooks
│       ├── types
│       ├── utils
│       └── magnetGameSlice.ts
├── /hooks                 # Reusable custom hooks
├── /models                # Game models (Ball, Magnet, etc.)
├── /router                # App routing
│   └── index.ts
├── /store
│   └── rootReducer.ts     # Centralized Redux store
└── main.tsx               # Entry point
```

---

## 🧩 Game Mechanics & Architecture

### Core Mechanics:

- Magnetic forces with distance-based falloff.
- Ball interacts with walls, magnets, and target areas.
- Toggle magnets between attracting and repelling.

### Level System:

- Level IDs:
  - `100-199`: Regular Magnets
  - `200-299`: Electromagnets
- Each level includes:
  - Wall and magnet configurations
  - Start and goal positions
  - Magnet limit

### Physics:

- Uses Matter.js + custom magnetic force calculations
- Real-time magnetic field visualizations
- Collision detection and object interactions

---

## 🏠 Architectural Patterns

### ✔ Redux Pattern (Flux Architecture)

- Centralized store in `store/rootReducer.ts`
- Slices:
  - `magnetGameSlice.ts`
  - `electroGameSlice.ts`
  - `levelSlice.ts`
  - `playerSlice.ts`
- Actions follow Command Pattern (e.g., `placeMagnet`, `togglePolarity`)

### ✔ Custom Hooks Pattern

Located in `/hooks` and `/features/.../hooks`:

- `useGameEngineMagnet`
- `useSandboxEngine`
- `useDB`
- `useUnmountEffect`

### ✔ Model-View Pattern

- Models in `/models`: `Ball.ts`, `Magnet.ts`, etc.
- Views in React components (`/features/**/components`)
- Logic via Redux and custom hooks

### ✔ Service Pattern

- `/db/services/` handles DB logic
- Use services for fetching, updating, and persisting data

### ✔ Factory Pattern

- Centralized level creation and game object instantiation

### ✔ Strategy Pattern

- Supports varying magnetic force calculations
- Multiple gameplay strategies for magnets

### ✔ Singleton Pattern

- Singleton Redux store
- Singleton database client instance

### ✔ Dependency Injection

- Context API & custom hooks for injecting shared resources

---

## 🔪 Testing

> _TBD based on your setup. Placeholder below:_

- **Unit Tests**: Recommended for models and utility functions
- **Integration Tests**: Redux slices and game engine
- **Manual Tests**: Sandbox mode for real-time testing
- **Unit Testing**: Vitest + React Testing Library
- **E2E (future)**: Cypress or Playwright

---

### Explore the Game

Open your browser at [http://localhost:5173](http://localhost:5173)

---

## ✍️ Contributing Guidelines

### ✅ Good First Tasks

- Add new levels (see `/config/levels.ts`)
- Fix UI bugs in magnet placement
- Refactor hooks or improve tests
- Add custom level builder UI

### 📊 Code Style

- Use TypeScript
- Use feature-first folder structure
- Prefer Redux Toolkit slices
- Prefer custom hooks over context for logic reuse
- Use interfaces from `/models` when possible

### 🗃️ Commits

Use conventional commit messages:

```bash
feat: add new magnet toggle feature
fix: correct ball collision behavior
refactor: improve game engine logic
```

---

## 📐 Ground Rules

**Before** making a change in the code, please ensure:

- You MUST read the contents of the file again, because I might have changed it. You must respect the changes I made.
- You don't break existing functionality.
- You must must express what your plan and every step is in detail.
- You must ask questions if you are unsure about something.

**After** you have made a change, please ensure:

- You have tested your changes thoroughly.
- You achieve the desired outcome with the minimum code changes.

---

## 📘 Further Reading

- [Matter.js Docs](https://brm.io/matter-js/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [p5.js Reference](https://p5js.org/reference/)
- [React + Vite](https://vitejs.dev/guide/)

---

## 🧲 Have Fun & Contribute!

Whether you’re fixing a bug, creating a new level, or helping shape the future of the game—thank you for contributing! This project is all about making learning fun.

You can find a `CONTRIBUTING.md` file in the root directory for more specific guidelines. We highly encourage you to read it before making any contributions.

🧠💡🧲⚡
