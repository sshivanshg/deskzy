/**
 * OpenNext (monorepo) sometimes writes duplicate env exports into
 * .open-next/cloudflare/next-env.mjs, which breaks wrangler deploy.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "../.open-next/cloudflare/next-env.mjs");

if (!fs.existsSync(file)) {
  console.error("Missing", file);
  process.exit(1);
}

const seen = new Set();
const out = [];
for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
  if (line.startsWith("export const ")) {
    const name = line.split("=", 1)[0].replace("export const", "").trim();
    if (seen.has(name)) continue;
    seen.add(name);
  }
  out.push(line);
}

while (out.length && out[out.length - 1] === "") out.pop();
fs.writeFileSync(file, out.join("\n") + "\n");
console.log("Deduped next-env exports:", [...seen].join(", "));
