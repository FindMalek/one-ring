import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { DetectResult } from "../cli/detect";
import { commandExists, run } from "../cli/lib/exec";
import { ensureSymlink } from "../cli/lib/symlink";
import { cursorUserDir, windsurfUserDir } from "../cli/user-paths";

function loadExtensionIds(configDir: string): string[] {
  const p = join(configDir, "ide", "extensions.json");
  if (!existsSync(p)) return [];
  const raw = JSON.parse(readFileSync(p, "utf8"));
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === "string");
  }
  if (raw && Array.isArray(raw.recommendations)) {
    return raw.recommendations.filter((x: unknown): x is string => typeof x === "string");
  }
  return [];
}

export async function applyIde(configDir: string, d: DetectResult, dryRun: boolean): Promise<void> {
  const ide = resolve(configDir, "ide");
  const kb = join(ide, "keybindings.json");
  const st = join(ide, "settings.json");

  if (existsSync(kb)) {
    if (dryRun) {
      console.log(`[dry-run] symlink ${join(cursorUserDir(d), "keybindings.json")} → ${kb}`);
      console.log(`[dry-run] symlink ${join(windsurfUserDir(d), "keybindings.json")} → ${kb}`);
    }
    ensureSymlink(join(cursorUserDir(d), "keybindings.json"), kb, { dryRun, backup: true });
    ensureSymlink(join(windsurfUserDir(d), "keybindings.json"), kb, { dryRun, backup: true });
  }
  if (existsSync(st)) {
    if (dryRun) {
      console.log(`[dry-run] symlink ${join(cursorUserDir(d), "settings.json")} → ${st}`);
      console.log(`[dry-run] symlink ${join(windsurfUserDir(d), "settings.json")} → ${st}`);
    }
    ensureSymlink(join(cursorUserDir(d), "settings.json"), st, { dryRun, backup: true });
    ensureSymlink(join(windsurfUserDir(d), "settings.json"), st, { dryRun, backup: true });
  }

  const ids = loadExtensionIds(configDir);
  for (const id of ids) {
    if (dryRun) {
      console.log(`[dry-run] cursor --install-extension ${id}`);
      console.log(`[dry-run] windsurf --install-extension ${id} (if available)`);
      continue;
    }
    if (await tryInstall("cursor", id)) continue;
    await tryInstall("windsurf", id);
  }
}

async function tryInstall(cli: string, id: string): Promise<boolean> {
  if (!commandExists(cli)) return false;
  const r = await run(cli, ["--install-extension", id]);
  return r.code === 0;
}
