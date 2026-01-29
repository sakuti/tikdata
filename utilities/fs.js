import fs from "fs";
import path from "path";

export function ensureDir(dirPath) {
  const fullPath = path.resolve(dirPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created folder: ${fullPath}`);
  }
}

export function ensurePath(baseDir, ...subPaths) {
  const fullPath = path.join(baseDir, ...subPaths);
  ensureDir(fullPath);
  return fullPath;
}
