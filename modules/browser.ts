import { spawn } from "node:child_process";
import type { DetectResult } from "../cli/detect";
import type { ExtensionEntry } from "../cli/lib/schemas";

function platformActive(d: DetectResult, p: "mac" | "linux"): boolean {
  if (p === "mac") return d.os === "darwin";
  return d.os === "linux";
}

export function applyBrowserExtensions(entries: ExtensionEntry[], d: DetectResult, dryRun: boolean): void {
  for (const e of entries) {
    const plats = e.platforms ?? ["mac", "linux"];
    const onMac = plats.includes("mac") && platformActive(d, "mac");
    const onLinux = plats.includes("linux") && platformActive(d, "linux");
    if (onMac) {
      const url = `https://chromewebstore.google.com/detail/onering-link/${e.chrome_id}`;
      if (dryRun) console.log(`[dry-run] open: ${e.name} (Chrome) → ${url}`);
      else openUrl(url);
    }
    if (onLinux) {
      const url = `https://addons.mozilla.org/firefox/search/?q=${encodeURIComponent(e.name)}`;
      if (dryRun) console.log(`[dry-run] open: ${e.name} (Firefox) → ${url}`);
      else openUrl(url);
    }
  }
}

function openUrl(url: string): void {
  const bin = process.platform === "darwin" ? "open" : process.platform === "linux" ? "xdg-open" : "open";
  const child = spawn(bin, [url], { stdio: "ignore", detached: true });
  child.unref();
}
