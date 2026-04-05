import {
  existsSync,
  lstatSync,
  mkdirSync,
  readlinkSync,
  renameSync,
  symlinkSync,
  unlinkSync,
} from "node:fs";
import { dirname } from "node:path";

export type SymlinkOptions = {
  /** If target exists and is not the correct symlink, rename to `.bak` before replacing */
  backup?: boolean;
  dryRun?: boolean;
};

/**
 * Create parent dirs and replace or create a symlink at `linkPath` → `targetPath` (absolute target recommended).
 */
export function ensureSymlink(linkPath: string, targetPath: string, options: SymlinkOptions = {}): void {
  if (options.dryRun) return;

  const dir = dirname(linkPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  if (existsSync(linkPath)) {
    let isLink = false;
    try {
      isLink = lstatSync(linkPath).isSymbolicLink();
    } catch {
      /* ignore */
    }
    if (isLink) {
      try {
        const current = readlinkSync(linkPath);
        if (current === targetPath || resolveSame(linkPath, current, targetPath)) {
          return;
        }
      } catch {
        /* fall through to replace */
      }
    }
    if (options.backup) {
      const bak = `${linkPath}.bak`;
      if (existsSync(bak)) unlinkSync(bak);
      renameSync(linkPath, bak);
    } else {
      unlinkSync(linkPath);
    }
  }

  symlinkSync(targetPath, linkPath);
}

function resolveSame(_linkPath: string, current: string, wanted: string): boolean {
  // Best-effort: compare as-is and normalized
  return current === wanted || current.replace(/\/$/, "") === wanted.replace(/\/$/, "");
}
