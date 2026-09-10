import { rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import packageJSON from "../package.json" with { type: "json" };

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const plugin = join(dist, "Refresh.rightmenuplugin");
const archive = join(dist, `RightMenu-Refresh-${packageJSON.version}.zip`);

await rm(archive, { force: true });

const result = spawnSync(
  "/usr/bin/ditto",
  ["-c", "-k", "--norsrc", "--keepParent", plugin, archive],
  { stdio: "inherit" }
);
if (result.status !== 0) {
  throw new Error(`ditto failed with status ${result.status ?? "unknown"}`);
}

console.log(archive);
