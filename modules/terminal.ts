import { join, resolve } from "node:path";
import { ensureSymlink } from "../cli/lib/symlink";
import { zshAliasesPath, zshrcPath, ghosttyConfigPath } from "../cli/user-paths";

export function applyTerminal(configDir: string, dryRun: boolean): void {
  const term = resolve(configDir, "terminal");
  const links: [string, string][] = [
    [zshrcPath(), join(term, ".zshrc")],
    [zshAliasesPath(), join(term, "aliases.zsh")],
    [ghosttyConfigPath(), join(term, "ghostty", "config.ghostty")],
  ];
  for (const [dest, src] of links) {
    if (dryRun) console.log(`[dry-run] symlink ${dest} → ${src}`);
    ensureSymlink(dest, src, { dryRun, backup: true });
  }
}
