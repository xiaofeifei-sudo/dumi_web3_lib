const fs = require("node:fs/promises");
const path = require("path");

async function main() {
  const cwd = process.cwd();
  const packagesDir = path.join(cwd, "packages");
  const rootPkg = require(path.join(cwd, "package.json"));
  const buildScript =
    (rootPkg && rootPkg.scripts && rootPkg.scripts["build:packages"]) || "";
  const exclude = new Set();
  const skipPkgNames = new Set(["pelican-web3-lib-icons"]);
  const excludeMatches = [...buildScript.matchAll(/--filter\s+['"]?!\.\/packages\/([^'"]+)['"]?/g)];
  for (const m of excludeMatches) {
    if (m[1]) exclude.add(m[1]);
  }
  const entries = await fs.readdir(packagesDir, { withFileTypes: true });
  const pkgNames = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (exclude.has(entry.name)) continue;
    const pkgJsonPath = path.join(packagesDir, entry.name, "package.json");
    try {
      const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, "utf8"));
      if (pkgJson.name) {
        if (skipPkgNames.has(pkgJson.name)) continue;
        pkgNames.push(pkgJson.name);
      }
    } catch {}
  }
  if (pkgNames.length === 0) {
    console.error("No packages found matching build:packages filters");
    process.exit(1);
  }
  const changesetDir = path.join(cwd, ".changeset");
  await fs.mkdir(changesetDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `patch-${timestamp}.md`;
  const filePath = path.join(changesetDir, filename);
  const headerLines = ["---", ...pkgNames.map((n) => `"${n}": patch`), "---"];
  const summary = "Patch release";
  const content = `${headerLines.join("\n")}\n\n${summary}\n`;
  await fs.writeFile(filePath, content, "utf8");
  console.log(`Created changeset: ${path.relative(cwd, filePath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
