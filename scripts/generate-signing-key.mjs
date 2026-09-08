import { generateKeyPairSync } from "node:crypto";
import { chmod, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const keyDirectory = join(root, ".keys");
const privateKeyPath = join(keyDirectory, "refresh-ed25519-private.pem");
const publicKeyPath = join(root, "publisher-public-key.txt");
const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const privatePEM = privateKey.export({ type: "pkcs8", format: "pem" });
const publicDER = publicKey.export({ type: "spki", format: "der" });
const rawPublicKey = publicDER.subarray(publicDER.length - 32).toString("base64");

await mkdir(keyDirectory, { recursive: true, mode: 0o700 });
await writeFile(privateKeyPath, privatePEM, { encoding: "utf8", mode: 0o600, flag: "wx" });
await chmod(privateKeyPath, 0o600);
await writeFile(publicKeyPath, `${rawPublicKey}\n`, "utf8");
console.log(`Created local signing key and ${publicKeyPath}`);
