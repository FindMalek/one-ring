import { detect, isDebianFamily } from "./detect";
import { commandExists, run } from "./lib/exec";

export type Check = { name: string; ok: boolean; detail?: string };

export async function runDoctor(): Promise<Check[]> {
  const d = detect();
  const checks: Check[] = [];

  checks.push({
    name: "platform",
    ok: d.os === "darwin" || d.os === "linux",
    detail: `${d.os} ${d.arch}${d.linux ? ` (${d.linux.prettyName})` : ""}`,
  });

  if (d.os === "darwin") {
    checks.push(await checkCmd("homebrew", "brew", ["--version"]));
    checks.push({
      name: "karabiner-elements",
      ok: true,
      detail: "Install GUI via: brew install --cask karabiner-elements",
    });
  }

  if (d.os === "linux") {
    checks.push(await checkCmd("apt", "apt", ["--version"]));
    checks.push(await checkCmd("flatpak", "flatpak", ["--version"]));
    const keyd = await checkCmd("keyd", "keyd", ["-v"]);
    checks.push({
      ...keyd,
      name: "keyd",
      detail: keyd.ok ? keyd.detail : `${keyd.detail ?? ""} Install: sudo apt install keyd (Debian/Ubuntu universe)`,
    });
    if (d.linux) {
      checks.push({
        name: "debian-family",
        ok: isDebianFamily(d),
        detail: isDebianFamily(d) ? "apt-based distro detected" : "OneRing Linux paths target apt/flatpak; other distros may need manual steps",
      });
    }
  }

  return checks;
}

async function checkCmd(name: string, cmd: string, args: string[]): Promise<Check> {
  if (!commandExists(cmd)) {
    return { name, ok: false, detail: `${cmd} not found in PATH` };
  }
  const r = await run(cmd, args);
  return {
    name,
    ok: r.code === 0,
    detail: r.code === 0 ? r.stdout.trim().split("\n")[0]?.slice(0, 120) : r.stderr.trim().slice(0, 200),
  };
}

export function printDoctor(checks: Check[]): void {
  for (const c of checks) {
    const icon = c.ok ? "✓" : "✗";
    console.log(`${icon} ${c.name}${c.detail ? `: ${c.detail}` : ""}`);
  }
}
