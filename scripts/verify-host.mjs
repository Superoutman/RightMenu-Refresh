import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hostRoot = resolve(root, "../../RightMenu");
const packageRoot = join(root, "dist/Refresh.rightmenuplugin");
const publicKey = (await readFile(join(root, "publisher-public-key.txt"), "utf8")).trim();
const swift = [
  "run", "--package-path", hostRoot, "rightmenu-pluginctl"
];

execFileSync("swift", [...swift, "validate-signed", packageRoot, "rightmenu-refresh-2026-01", publicKey], {
  stdio: "inherit"
});
const catalogRoot = await mkdtemp(join(tmpdir(), "rightmenu-refresh-catalog-"));
try {
  const installed = execFileSync("swift", [
    ...swift, "install-signed", packageRoot, "rightmenu-refresh-2026-01", publicKey,
    "--root", catalogRoot
  ], { encoding: "utf8" });
  process.stdout.write(installed);
  if (!installed.includes("grants=ui.flashScreen")) {
    throw new Error("Refresh was not ready immediately after signed import");
  }
} finally {
  await rm(catalogRoot, { recursive: true, force: true });
}
const output = execFileSync("swift", [
  ...swift, "run", packageRoot, "refresh",
  "--grant", "ui.flashScreen",
  "--runner", join(hostRoot, ".build/debug/RightMenuPluginRunner")
], { encoding: "utf8" });
if (JSON.parse(output).displayed !== true) throw new Error("host did not accept the refresh effect");
console.log("RightMenu host signature and Refresh capability verification passed");
