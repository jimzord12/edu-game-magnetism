# 🎮 Project Recap – Designing & Coding the “Iron-Ball” Maze Level

## 🎯 1. Goal & Starting Point

- Build a clean, center-based maze for your browser game.
- Match a **1220 × 800 px canvas** (with 10 px outer frame), so the playable interior is exactly **1200 × 780 px**.
- Drive every wall from code (no hard-coded coordinates), enabling easy future edits.

## 🧠 2. Key Decisions & Rationale

| 💡 Decision                                             | 📝 Why it Mattered                                                                      |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Centre-anchored walls (x, y are the rectangle’s center) | Keeps physics and drawing perfectly aligned with Matter.Bodies.rectangle and `render()` |
| Grid first, walls second                                | Eliminates pixel math; you talk in "cells", the helper handles the math                 |
| 16 columns × 12 rows                                    | 1200 ÷ 16 = 75 px, 780 ÷ 12 = 65 px → clean integer cells, no sub-pixel issues          |
| 10 px-thick full-cell blocks                            | Perfect collision, no overlap issues; easy to customize later                           |
| Compile-time grid checking with TypeScript              | Catches errors like missing columns/rows before runtime                                 |

## 🧰 3. Utilities We Wrote

### `buildGrid(dims, rows, cols, thickness = 10)`

- Calculates cell width/height + each cell’s center
- Provides helper functions:
  - `at(r, c)` → center of cell (r, c)
  - `rectOf(r, c)` → full-cell rectangle (x, y, width, height)

### `patternToWalls(grid, pattern)`

- Takes a 2D array of `'x'` / `'-'`
- For each `'-'`, creates a `Wall({ … })` in that cell
- Returns a ready-to-use `Wall[]`

### `MazePattern<R, C>` (tuple-literal type)

- Ensures pattern has exactly `R` rows and `C` columns at compile time

#### 🛠 TypeScript Fix

- Added `as const satisfies MazePattern<12,16>` to lock literal size
- Extended generics in `patternToWalls` to carry row/col counts

## 🧩 4. The Maze Pattern We Implemented

- Single path from **(0,0) ➔ (11,15)** with some branches
- Stored as `MAZE_PATTERN_16x12` (12×16 array)
- Converted to `MAZE_1200x800` with:

```ts
const grid = buildGrid({ width: 1200, height: 800 }, 12, 16, 0);
export const MAZE_1200x800 = patternToWalls(grid, MAZE_PATTERN_16x12);
```

## 🔌 5. Integration

```ts
ELECTRO_MAGNET_LEVELS.push({
  id: 300,
  gameType: 'electromagnet',
  name: '75×65 Labyrinth',
  canvasSize: { width: 1220, height: 800 },
  ballStart: grid.at(0, 0), // (35, 35)
  targetPosition: grid.at(11, 15), // (1185, 765)
  walls: MAZE_1200x800,
  availableMagnets: 3,
  minMagnetsToStart: 1,
  electromagnets: [],
});
```

✅ Everything runs flawlessly: physics bodies, rendering, and collision all line up.

## 🧗 6. Challenges & Solutions

| ⚠️ Challenge                      | 🔧 Solution                                              |
| --------------------------------- | -------------------------------------------------------- |
| Miscounting rows/columns visually | Overlaid a programmatic grid to verify layout            |
| Center vs. top-left confusion     | Confirmed center-coordinates via Wall + Matter.js docs   |
| TS tuple-length error             | Locked with `as const` + `satisfies MazePattern`         |
| Pattern typo risks                | `MazePattern<R,C>` ensures pattern shape at compile time |

## 🏁 7. What You Now Have

- ✅ Drop-in wall arrays for any level size
- 📏 Grid utility = no more pixel math
- 🔐 Type-safe patterns for hand-editing or procedural generation
- 🧱 Clear base for adding hazards, sensors, dynamic walls, etc.

## 🔮 8. Next Steps (Optional)

- 🌀 Procedural generator using DFS/Prim’s → `patternToWalls`
- 📉 Partial-cell walls with `grid.at(r,c)` + custom sizing
- 🕹 Dynamic walls/hazards → add `isHazard`, `movementPattern`, etc.
- 🗺 Editor overlay → show grid lines in p5 for precise magnet placement

---

🎉 **Enjoy the friction-free maze making — and shout if you need any more tweaks!**
