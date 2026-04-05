import type { DetectResult } from "../cli/detect";
import { run } from "../cli/lib/exec";
import type { PackageEntry } from "../cli/lib/schemas";

function pickCommand(entry: PackageEntry, d: DetectResult): string | null {
  if (d.os === "darwin") return entry.mac ?? null;
  if (d.os === "linux") return entry.linux ?? null;
  return null;
}

export async function applyCorePackages(
  entries: PackageEntry[],
  d: DetectResult,
  dryRun: boolean,
): Promise<void> {
  for (const e of entries) {
    const cmd = pickCommand(e, d);
    if (!cmd?.trim()) continue;
    if (dryRun) {
      console.log(`[dry-run] core: ${e.name}: ${cmd}`);
      continue;
    }
    console.log(`Installing core: ${e.name}…`);
    const shell = process.env.SHELL || "/bin/sh";
    const r = await run(shell, ["-lc", cmd]);
    if (r.code !== 0) {
      console.error(`Failed ${e.name}: ${r.stderr || r.stdout}`);
    }
  }
}
