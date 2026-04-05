import { existsSync } from "node:fs";
import { join } from "node:path";
import { resolveRepoRoot } from "./paths";
import { run } from "./lib/exec";
import { applyProfile } from "./apply";

export type SyncOptions = {
  configDir: string;
  profile: string;
  dryRun: boolean;
};

export async function syncRepo(opts: SyncOptions): Promise<void> {
  const root = resolveRepoRoot(opts.configDir);
  const gitDir = join(root, ".git");
  if (!existsSync(gitDir)) {
    console.warn("No .git directory at repo root; skipping git pull. Set ONERING_ROOT or run from a clone.");
  } else if (opts.dryRun) {
    console.log(`[dry-run] git -C ${root} pull --ff-only`);
  } else {
    const r = await run("git", ["-C", root, "pull", "--ff-only"]);
    if (r.code !== 0) {
      console.error(`git pull failed: ${r.stderr || r.stdout}`);
      process.exitCode = 1;
      return;
    }
  }

  await applyProfile({ configDir: opts.configDir, profile: opts.profile, dryRun: opts.dryRun });
}
