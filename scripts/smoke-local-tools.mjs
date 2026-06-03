import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const data = JSON.parse(readFileSync(new URL("../data/index.json", import.meta.url), "utf8"));
const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const searchIndex = JSON.parse(readFileSync(new URL("../dist/search-index.json", import.meta.url), "utf8"));
const hardwareMap = JSON.parse(readFileSync(new URL("../dist/hardware-map.json", import.meta.url), "utf8"));
const failures = [];

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function expectedExport(subpath) {
  const target = packageJson.exports?.[subpath];
  assert(typeof target === "string", `package export ${subpath} is missing`);
  if (typeof target === "string") {
    assert(existsSync(new URL(`../${target.replace(/^\.\//, "")}`, import.meta.url)), `package export ${subpath} target is missing: ${target}`);
  }
}

function runQuery(args) {
  const result = spawnSync(process.execPath, ["scripts/query-index.mjs", ...args], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });

  if (result.status !== 0) {
    fail(`query failed: ${args.join(" ")}\n${result.stderr || result.stdout}`);
  }

  return result.stdout;
}

expectedExport("./index");
expectedExport("./summary");
expectedExport("./categories");
expectedExport("./hardware-map");
expectedExport("./search-index");
expectedExport("./entries.csv");
expectedExport("./schema");

assert(searchIndex.length === data.entries.length, "search-index entry count must match data entries");
assert(searchIndex.every((entry) => typeof entry.search_text === "string" && entry.search_text.length > 0), "every search-index record needs search_text");
assert(hardwareMap.some((item) => item.hardware === "Universal Robots CB3" && item.entries.some((entry) => entry.repo === "UniversalRobots/Universal_Robots_ROS2_Driver")), "hardware-map must include Universal Robots CB3 lookup");

const realsense = runQuery(["--q", "realsense"]);
assert(realsense.includes("Found 1 matching entries."), "realsense query should return exactly one entry");
assert(realsense.includes("RealSense ROS"), "realsense query should include RealSense ROS");

const lidarCount = data.entries.filter((entry) => entry.category === "lidar").length;
const lidar = runQuery(["--category", "lidar", "--limit", "2"]);
assert(lidar.includes(`Found ${lidarCount} matching entries (showing 2).`), "lidar limited query should report total and shown count");

const universalRobots = runQuery(["--hardware", "Universal Robots"]);
assert(universalRobots.includes("Universal Robots ROS 2 Driver"), "hardware query should find Universal Robots driver");

const jsonOutput = runQuery(["--q", "ros2_control", "--json"]);
const jsonResults = JSON.parse(jsonOutput);
assert(Array.isArray(jsonResults), "json query should return an array");
assert(jsonResults.some((entry) => entry.repo === "ros-controls/ros2_control"), "json query should include ros2_control");

const noResults = runQuery(["--q", "definitely-not-a-real-driver-name"]);
assert(noResults.trim() === "Found 0 matching entries.", "empty query result should be explicit");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Smoke-tested local search, hardware map, and package exports");
