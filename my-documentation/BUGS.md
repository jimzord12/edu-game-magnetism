# Bugs

## Known Bugs

- **Issue #1**: When the Game restarts, the default Magnets are not reset. They are not re-added into the game. No Idea why. For now, just restart the whole page.

### Related with Object Movement

- **Issue #2**: The Moving Walls do not get reset when the player loses or resets the game.
- **Issue #3**: The Moving Walls do not have a consistent pattern.
  - **Solved ✅**: The Moving Walls now have a consistent pattern. The problem was I used the body.position which is dynamic. I needed the origin static position. For this I created a Base Class called "Point" which simple accepts 2 parameters (x,y) and attached them to is fields.
- **Issue #4**: Moving Walls may experience Multiple calls per frame. This has the effect of making the Compounds drift. To fix we need to Ensure single call per frame.
- **Issue #5**: Moving Walls do no reset on restart, we nee to make them Reset to initial position.
- **Issue #6**: Moving Walls need more string type safety, to create a more robust and maintainable code. We should add same type guards.

### Build Issues

⚠️ Detailed Guide: sqlocal + Vite Build Error (worker.format = "iife")

1. What exactly is happening?

[commonjs--resolver] Invalid value "iife" for option "worker.format" - UMD and IIFE output formats are not supported for code‑splitting builds.
file: node_modules/sqlocal/dist/client.js

Vite delegates production bundling to Rollup.

sqlocal ships a Web Worker that is pre‑bundled as IIFE (Immediately‑Invoked Function Expression).

Rollup forbids using worker.format: 'iife' (or 'umd') whenever code‑splitting is enabled (the default in Vite 4‑6).→ Rollup aborts, Vite reports the error, build fails.

The problem is in the library build, not in your app.

2. Why does Rollup forbid IIFE Workers?

Rollup can only rewrite ES‑module workers correctly when it is splitting code into many chunks. IIFE/UMD bundles are opaque blobs; Rollup can’t safely reference them, so it simply blocks the configuration.

3. All practical ways to fix / work around it

#

Strategy

Effort

Pro

Con

0

Wait for upstream (sqlocal publishes an ES‑module build)

none

cleanest

depends on maintainer; no ETA

A

Switch libraries (e.g. Dexie.js, sql.js, localForage)

★☆☆

immediate build success

migration work

B

Dynamic‑import + externalise ← this doc

★★☆

keep sqlocal, no fork needed

extra runtime request; CDN caching; need ambient types

C

Mark library external & inject manually

★★☆

zero code changes inside app

global namespace pollution; manual script management

D

Fork / patch sqlocal and rebuild worker in ES format

★★★

no runtime indirection

you maintain a fork forever

E

Disable code‑splitting entirely (manualChunks: undefined)

★☆☆

tiny change

larger bundle; some plugins still touch worker and break

Option E often fails because other plugins still inspect worker code, so sqlocal remains the only reliable block.

4. Implementing Option B step‑by‑step (keep the lib, load at runtime)

4‑a · Tell Vite not to bundle it

// vite.config.ts
export default defineConfig({
optimizeDeps: { exclude: ['sqlocal'] },
build: {
rollupOptions: {
external: ['sqlocal'], // ← key line
output: { manualChunks: undefined }
}
}
});

optimizeDeps.exclude — dev‑server pre‑bundler ignores it.

external — production build skips bundling entirely.

4‑b · Load the module on‑demand with esm.sh

// src/db/sqlocal.ts (utility wrapper)
export async function getSQLocal() {
/_ @vite-ignore _/
const { SQLocal } = await import(
'https://esm.sh/sqlocal@latest/dist/client.js'
);
return new SQLocal({ name: 'magnetism-db' });
}

@vite-ignore stops Vite from analysing the URL.

esm.sh converts CommonJS/IIFE packages to stand‑alone ES modules on‑the‑fly.

Usage inside React:

import { useEffect, useState } from 'react';
import type { SQLocalType } from './types/sqlocal';

export function useDB() {
const [db, setDb] = useState<SQLocalType | null>(null);

useEffect(() => {
let cancel = false;
(async () => {
const dbInstance = await getSQLocal();
if (!cancel) setDb(dbInstance);
})();
return () => { cancel = true; };
}, []);

return db; // null until ready
}

4‑c · TypeScript ambient types

Create src/types/sqlocal.d.ts:

// Very loose – improve if you have real types
export interface SQLocalType {
new (opts: { name: string }): unknown;
// add methods you actually call
}

declare module 'https://esm.sh/sqlocal@*' {
export const SQLocal: SQLocalType;
}

Now getSQLocal() returns a typed instance and TS stops complaining.

5. Serving the ES‑module in production (if you don’t like CDNs)

Copy node_modules/sqlocal/dist/client.js to public/vendor/sqlocal.js (use vite-plugin-static-copy).

Change the import URL:

await import('/vendor/sqlocal.js');

Because the file sits in /public, Vite copies it verbatim into dist/ and the browser fetches it the same way in production.

6. Key takeaways

The error is library‑side, not a mis‑configuration in your project.

Rollup will never allow IIFE/UMD workers with code‑splitting – you must move or hide them.

Option B lets you ship today with minimal code churn and no fork.

For long‑term health, consider migrating to a library that publishes modern ES builds.
