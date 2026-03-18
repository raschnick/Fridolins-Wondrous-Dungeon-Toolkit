import { copyFile, cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const sourceDir = path.join(rootDir, "node_modules", "@3d-dice", "dice-box", "dist")
const targetDir = path.join(rootDir, "public", "vendor", "dice-box")
const duplicateAssetsDir = path.join(rootDir, "public", "assets")
const runtimeFiles = [
  "dice-box.es.min.js",
  "Dice.min.js",
  "world.offscreen.min.js",
  "world.onscreen.min.js",
  "world.none.min.js"
]

async function exists(filePath) {
  try {
    await stat(filePath)
    return true
  } catch (_error) {
    return false
  }
}

if (!(await exists(sourceDir))) {
  console.warn("Dice Box dist folder not found, skipping vendor sync.")
  process.exit(0)
}

await rm(targetDir, { recursive: true, force: true })
await mkdir(targetDir, { recursive: true })

for (const fileName of runtimeFiles) {
  const sourceFile = path.join(sourceDir, fileName)
  const targetFile = path.join(targetDir, fileName)
  await copyFile(sourceFile, targetFile)
  const content = await readFile(targetFile, "utf8")
  await writeFile(targetFile, content.replace(/\n\/\/# sourceMappingURL=.*$/m, ""))
}

await cp(path.join(sourceDir, "assets"), path.join(targetDir, "assets"), {
  recursive: true,
  force: true
})

await rm(path.join(duplicateAssetsDir, "ammo"), { recursive: true, force: true })
await rm(path.join(duplicateAssetsDir, "themes"), { recursive: true, force: true })

if (await exists(duplicateAssetsDir)) {
  const remaining = await readdir(duplicateAssetsDir)
  if (remaining.length === 0) {
    await rm(duplicateAssetsDir, { recursive: true, force: true })
  }
}

console.log(`Synced Dice Box assets to ${path.relative(rootDir, targetDir)}`)
