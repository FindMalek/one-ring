import { existsSync } from "node:fs";
import { dirname, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolve the directory containing `config/` (the config root parent).
 * Priority: ONERING_CONFIG (path to config dir), ONERING_ROOT (repo root), walk-up `config/`, then ./config from cwd.
 */
export function resolveConfigDir(cwd: string = process.cwd()): string {
  const envConfig = process.env.ONERING_CONFIG?.trim();
  if (envConfig) {
    return resolve(envConfig);
  }

  const envRoot = process.env.ONERING_ROOT?.trim();
  if (envRoot) {
    return resolve(join(envRoot, "config"));
  }

  const fromWalk = findConfigDirWalkingUp(resolve(cwd));
  if (fromWalk) return fromWalk;

  return resolve(cwd, "config");
}

/**
 * Repo root (directory containing `config/`), for sync/git operations.
 */
export function resolveRepoRoot(configDir: string): string {
  const base = dirname(resolve(configDir));
  const name = configDir.split(/[/\\]/).pop();
  if (name === "config") return base;
  return base;
}

function findConfigDirWalkingUp(start: string): string | undefined {
  let dir = start;
  const { root } = parse(start);
  for (;;) {
    const candidate = join(dir, "config");
    if (existsSync(candidate) && isConfigTree(candidate)) {
      return candidate;
    }
    if (dir === root) break;
    dir = dirname(dir);
  }
  return undefined;
}

function isConfigTree(dir: string): boolean {
  try {
    return existsSync(join(dir, "profiles")) || existsSync(join(dir, "keyboard"));
  } catch {
    return false;
  }
}

/** Directory where this module lives (typically `cli/`). */
export function resolveCliDir(): string {
  return dirname(fileURLToPath(import.meta.url));
}
