#!/usr/bin/env bun
import { runDoctor, printDoctor } from "./doctor";
import { resolveConfigDir } from "./paths";

const VERSION = "0.1.0";

function usage(): void {
  console.log(`onering ${VERSION}

Usage:
  onering version
  onering doctor
  onering wizard [--dry-run]
  onering apply --profile <name> [--dry-run]
  onering sync [--profile <name>] [--dry-run]
  onering compile-keyboard [--out-dir <path>]

Environment:
  ONERING_CONFIG   Path to config directory (contains profiles/, keyboard/, …)
  ONERING_ROOT     Repository root; config is <root>/config
`);
}

function parseArgs(argv: string[]): { cmd: string; flags: Record<string, string | boolean> } {
  const [, , ...rest] = argv;
  const cmd = rest[0] ?? "help";
  const flags: Record<string, string | boolean> = {};
  for (let i = 1; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--dry-run") flags["dry-run"] = true;
    else if (a === "--profile" && rest[i + 1]) {
      flags.profile = rest[++i];
    } else if (a === "--out-dir" && rest[i + 1]) {
      flags["out-dir"] = rest[++i];
    }
  }
  return { cmd, flags };
}

async function main(): Promise<void> {
  const { cmd, flags } = parseArgs(process.argv);

  switch (cmd) {
    case "version":
    case "--version":
    case "-v":
      console.log(VERSION);
      return;
    case "doctor": {
      const checks = await runDoctor();
      printDoctor(checks);
      const bad = checks.filter((c) => !c.ok && !c.name.includes("(optional)"));
      process.exitCode = bad.length ? 1 : 0;
      return;
    }
    case "help":
    case "--help":
    case "-h":
      usage();
      return;
    default: {
      const mod = await import("./commands");
      const configDir = resolveConfigDir();
      const dryRun = flags["dry-run"] === true;
      const profile = typeof flags.profile === "string" ? flags.profile : "default";

      if (cmd === "wizard") {
        await mod.runWizard({ configDir, dryRun });
        return;
      }
      if (cmd === "apply") {
        await mod.runApply({ configDir, profile, dryRun });
        return;
      }
      if (cmd === "sync") {
        await mod.runSync({ configDir, profile, dryRun });
        return;
      }
      if (cmd === "compile-keyboard") {
        const outDir = typeof flags["out-dir"] === "string" ? flags["out-dir"] : undefined;
        await mod.runCompileKeyboard({ configDir, outDir, dryRun });
        return;
      }
      console.error(`Unknown command: ${cmd}`);
      usage();
      process.exitCode = 1;
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
