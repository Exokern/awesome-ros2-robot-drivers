import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

import { renderCurationReport } from "./render-curation-report.mjs";
import { renderReadme } from "./render-readme.mjs";

const indexPath = new URL("../data/index.json", import.meta.url);
const readmePath = new URL("../README.md", import.meta.url);
const docsDir = new URL("../docs/", import.meta.url);
const reportPath = new URL("../docs/curation-report.md", import.meta.url);

const data = JSON.parse(readFileSync(indexPath, "utf8"));

mkdirSync(docsDir, { recursive: true });
writeFileSync(readmePath, renderReadme(data));
writeFileSync(reportPath, renderCurationReport(data));

console.log("Generated README.md and docs/curation-report.md from data/index.json");
