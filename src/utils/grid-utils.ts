// grid-utils.ts ───────────────────────────────────────────────────────────────
import { Wall } from '@/models/Wall';

export type Dimensions = { width: number; height: number };
export type CellPos<R extends number, C extends number> = [
  row: 0 | (Exclude<number, never> & R),
  col: 0 | (Exclude<number, never> & C)
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. Build the grid
// ─────────────────────────────────────────────────────────────────────────────
export function buildGrid(
  dims: Dimensions,
  rows: number,
  cols: number,
  thickness = 10
) {
  // usable interior after subtracting the outer frame
  const usableW = dims.width - 2 * thickness;
  const usableH = dims.height - 2 * thickness;

  const cellW = usableW / cols;
  const cellH = usableH / rows;

  // pre-compute every cell centre
  const centres = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      x: thickness + cellW * c + cellW / 2,
      y: thickness + cellH * r + cellH / 2,
    }))
  );

  return {
    rows,
    cols,
    cellW,
    cellH,
    centres,

    /** centre of (row,col) */
    at: (row: number, col: number) => centres[row][col],

    /** rectangle that fills an entire cell (rarely used, but handy) */
    rectOf: (row: number, col: number) => ({
      x: centres[row][col].x,
      y: centres[row][col].y,
      width: cellW,
      height: cellH,
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Convert an 'x' / '-' pattern to Wall[]
//    '-'  → make a wall that fills the whole cell
//    'x'  → leave the cell empty
// ─────────────────────────────────────────────────────────────────────────────
export function patternToWalls<
  R extends number,
  C extends number // Add C to the generic parameters
>(
  grid: ReturnType<typeof buildGrid>,
  pattern: MazePattern<R, C> // 16 cols
  //   wallThickness = 10
): Wall[] {
  const walls: Wall[] = [];

  pattern.forEach((rowArr, r) =>
    rowArr.forEach((cell, c) => {
      if (cell === '-') {
        walls.push(
          new Wall({
            ...grid.rectOf(r, c), // fills the whole cell
            dimensions: {
              width: grid.cellW,
              height: grid.cellH,
            },
          })
        );
      }
    })
  );

  return walls;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Tuple-literal type generator (rows × cols)
//    Example: MazePattern<12, 16>  →  string[12][16]
// ─────────────────────────────────────────────────────────────────────────────
export type MazePattern<
  Rows extends number,
  Cols extends number
> = string[][] & { length: Rows } & { [R in number]: { length: Cols } };
