import { homedir } from "node:os";
import { join } from "node:path";
import type { DetectResult } from "./detect";

export function cursorUserDir(d: DetectResult): string {
  if (d.os === "darwin") {
    return join(homedir(), "Library", "Application Support", "Cursor", "User");
  }
  if (d.os === "linux") {
    return join(homedir(), ".config", "Cursor", "User");
  }
  return join(homedir(), ".config", "Cursor", "User");
}

export function windsurfUserDir(d: DetectResult): string {
  if (d.os === "darwin") {
    return join(homedir(), "Library", "Application Support", "Windsurf", "User");
  }
  if (d.os === "linux") {
    return join(homedir(), ".config", "Windsurf", "User");
  }
  return join(homedir(), ".config", "Windsurf", "User");
}

export function karabinerComplexModDir(): string {
  return join(homedir(), ".config", "karabiner", "assets", "complex_modifications");
}

export function ghosttyConfigPath(): string {
  return join(homedir(), ".config", "ghostty", "config.ghostty");
}

export function zshrcPath(): string {
  return join(homedir(), ".zshrc");
}

export function zshAliasesPath(): string {
  return join(homedir(), ".zshrc.d", "aliases.zsh");
}
