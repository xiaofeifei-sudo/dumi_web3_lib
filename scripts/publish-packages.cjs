const fs = require("node:fs/promises");
const path = require("node:path");
const { spawn } = require("node:child_process");

async function packagePublished(registry, name, version) {
  try {
    const base = registry.replace(/\/+$/, "");
    const url = `${base}/${encodeURIComponent(name)}`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) return false;
    const data = await res.json();
    const versions = (data && data.versions) || {};
    return Object.prototype.hasOwnProperty.call(versions, version);
  } catch {
    return false;
  }
}

async function publishOne(dir) {
  return new Promise((resolve) => {
    const child = spawn("pnpm", ["publish", "--no-git-checks", "--access", "public"], {
      cwd: dir,
      stdio: "inherit",
    });
    child.on("exit", (code) => resolve(code === 0));
    child.on("error", () => resolve(false));
  });
}

async function main() {
  const cwd = process.cwd();
  const packagesDir = path.join(cwd, "packages");
  const rootPkg = require(path.join(cwd, "package.json"));
  const publishScript =
    (rootPkg && rootPkg.scripts && rootPkg.scripts["publish:packages"]) || "";
  const exclude = new Set();
  const excludeMatches = [...publishScript.matchAll(/--filter\s+['"]?!\.\/packages\/([^'"]+)['"]?/g)];
  for (const m of excludeMatches) {
    if (m[1]) exclude.add(m[1]);
  }

  const entries = await fs.readdir(packagesDir, { withFileTypes: true });
  let publishedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (exclude.has(entry.name)) continue;
    const pkgDir = path.join(packagesDir, entry.name);
    const pkgJsonPath = path.join(pkgDir, "package.json");
    try {
      const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, "utf8"));
      const name = pkgJson.name;
      const version = pkgJson.version;
      const registry =
        (pkgJson.publishConfig && pkgJson.publishConfig.registry) ||
        (rootPkg.publishConfig && rootPkg.publishConfig.registry) ||
        "https://registry.npmjs.org";
      const exists = await packagePublished(registry, name, version);
      if (exists) {
        console.log(`[skip] ${name}@${version} already published`);
        skippedCount++;
        continue;
      }
      const ok = await publishOne(pkgDir);
      if (ok) {
        console.log(`[done] published ${name}@${version}`);
        publishedCount++;
      } else {
        console.error(`[fail] publish ${name}@${version}`);
        failedCount++;
      }
    } catch (e) {
      console.error(`[error] ${entry.name}: ${e && e.message}`);
      failedCount++;
    }
  }

  console.log(
    `Publish summary: done=${publishedCount}, skipped=${skippedCount}, failed=${failedCount}`
  );
  process.exit(failedCount === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

