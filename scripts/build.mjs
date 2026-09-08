import { createHash, createPrivateKey, sign } from "node:crypto";
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageRoot = join(root, "dist", "Refresh.rightmenuplugin");
const signed = process.argv.includes("--signed");

await rm(join(root, "dist"), { recursive: true, force: true });
await mkdir(packageRoot, { recursive: true });
await build({
  entryPoints: [join(root, "src/main.ts")],
  outfile: join(packageRoot, "main.js"),
  bundle: true,
  format: "iife",
  platform: "neutral",
  target: ["safari14"],
  legalComments: "none",
  minify: false,
  charset: "utf8"
});
await cp(join(root, "assets/icon.svg"), join(packageRoot, "icon.svg"));

async function regularFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) return regularFiles(absolute);
    if (!entry.isFile()) throw new Error(`unsupported package entry: ${absolute}`);
    return [absolute];
  }));
  return nested.flat();
}

const payloads = (await regularFiles(packageRoot)).sort();
const files = await Promise.all(payloads.map(async (absolute) => {
  const data = await readFile(absolute);
  const metadata = await stat(absolute);
  return {
    path: relative(packageRoot, absolute).split(sep).join("/"),
    byteCount: metadata.size,
    sha256: createHash("sha256").update(data).digest("hex")
  };
}));
const base = JSON.parse(await readFile(join(root, "plugin/manifest.base.json"), "utf8"));
const manifestData = Buffer.from(`${JSON.stringify({ ...base, files }, null, 2)}\n`, "utf8");
await writeFile(join(packageRoot, "manifest.json"), manifestData);

if (signed) {
  const privatePEM = await readFile(join(root, ".keys/refresh-ed25519-private.pem"), "utf8");
  const manifestSHA256 = createHash("sha256").update(manifestData).digest("hex");
  let payload = `RightMenu JavaScript Plugin Package v1\n${manifestSHA256}\n`;
  for (const file of [...files].sort((left, right) => Buffer.from(left.path).compare(Buffer.from(right.path)))) {
    payload += `${file.path}\t${file.byteCount}\t${file.sha256}\n`;
  }
  const signature = sign(null, Buffer.from(payload), createPrivateKey(privatePEM)).toString("base64");
  await writeFile(join(packageRoot, "_Signature.json"), `${JSON.stringify({
    format: "ed25519-v1",
    keyID: "rightmenu-refresh-2026-01",
    manifestSHA256,
    signature
  }, null, 2)}\n`, "utf8");
}

console.log(packageRoot);
