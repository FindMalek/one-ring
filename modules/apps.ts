import type { DetectResult } from "../cli/detect";
import { run } from "../cli/lib/exec";
import type { PackageEntry } from "../cli/lib/schemas";

export function pickCommand(entry: PackageEntry, d: DetectResult): string | null {
  if (d.os === "darwin") return entry.mac ?? null;
  if (d.os === "linux") return entry.linux ?? null;
  return null;
}

export function hasInstallForOs(entry: PackageEntry, d: DetectResult): boolean {
  const c = pickCommand(entry, d);
  return Boolean(c?.trim());
}

export async function installApps(
  catalog: PackageEntry[],
  selectedNames: string[],
  d: DetectResult,
  dryRun: boolean,
): Promise<void> {
  const byName = new Map(catalog.map((e) => [e.name, e]));
  for (const name of selectedNames) {
    const e = byName.get(name);
    if (!e) {
      console.warn(`Unknown app in profile: ${name}`);
      continue;
    }
    const cmd = pickCommand(e, d);
    if (!cmd?.trim()) {
      console.log(`Skip ${name} (no install command for this OS)`);
      continue;
    }
    if (dryRun) {
      console.log(`[dry-run] app ${name}: ${cmd}`);
      continue;
    }
    console.log(`Installing ${name}…`);
    const shell = process.env.SHELL || "/bin/sh";
    const r = await run(shell, ["-lc", cmd]);
    if (r.code !== 0) {
      console.error(`Failed ${name}: ${r.stderr || r.stdout}`);
    }
  }
}

export function mergeCatalog(macPath: PackageEntry[], linuxPath: PackageEntry[]): PackageEntry[] {
  const map = new Map<string, PackageEntry>();
  for (const e of macPath) map.set(e.name, { ...e });
  for (const e of linuxPath) {
    const cur = map.get(e.name);
    if (cur) {
      map.set(e.name, {
        name: e.name,
        mac: e.mac ?? cur.mac ?? null,
        linux: e.linux ?? cur.linux ?? null,
        category: e.category ?? cur.category,
      });
    } else {
      map.set(e.name, { ...e });
    }
  }
  return [...map.values()];
}
