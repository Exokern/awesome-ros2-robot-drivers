import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, "site");
const output = join(root, "_site");
const data = JSON.parse(readFileSync(join(root, "data", "index.json"), "utf8"));

rmSync(output, { recursive: true, force: true });
mkdirSync(join(output, "data"), { recursive: true });
cpSync(source, output, { recursive: true });
writeFileSync(join(output, "data", "index.json"), `${JSON.stringify(data, null, 2)}\n`);
writeFileSync(join(output, ".nojekyll"), "");

console.log(`Built GitHub Pages directory with ${data.entries.length} entries in _site/`);
