/**
 * Copies public/ and .next/static/ into the standalone output folder
 * so `node .next/standalone/server.js` can serve static assets.
 *
 * Uses Node.js built-ins only — works on Windows, Linux, and macOS
 * (Railway runs Linux; this also lets you test locally on any OS).
 */

import { cpSync, existsSync } from "fs";
import { join } from "path";

const root       = process.cwd();
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  console.log("No standalone folder found — skipping copy (non-standalone build).");
  process.exit(0);
}

// public/ → .next/standalone/public/
cpSync(join(root, "public"), join(standalone, "public"), { recursive: true });
console.log("✓ Copied public/ to .next/standalone/public/");

// .next/static/ → .next/standalone/.next/static/
cpSync(
  join(root, ".next", "static"),
  join(standalone, ".next", "static"),
  { recursive: true }
);
console.log("✓ Copied .next/static/ to .next/standalone/.next/static/");
