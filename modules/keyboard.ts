import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { compileKarabinerRules, karabinerRulesToJson } from "../compilers/karabiner";
import { compileKeydConf } from "../compilers/keyd";
import type { DetectResult } from "../cli/detect";
import { loadMapYaml } from "../cli/lib/config-load";
import { run, runWithStdin } from "../cli/lib/exec";
import { karabinerComplexModDir } from "../cli/user-paths";

const KEYD_TARGET = "/etc/keyd/onering.conf";

export async function applyKeyboard(configDir: string, d: DetectResult, dryRun: boolean): Promise<void> {
  const map = loadMapYaml(configDir);
  const genDir = join(configDir, "keyboard");
  if (!existsSync(genDir)) mkdirSync(genDir, { recursive: true });

  const rules = compileKarabinerRules(map);
  const kbJson = join(genDir, "karabiner.generated.json");
  if (!dryRun) {
    writeFileSync(kbJson, karabinerRulesToJson(rules) + "\n", "utf8");
  }

  if (d.os === "darwin") {
    const destDir = karabinerComplexModDir();
    const dest = join(destDir, "onering.json");
    if (dryRun) {
      console.log(`[dry-run] symlink/copy karabiner rules → ${dest}`);
    } else {
      mkdirSync(destDir, { recursive: true });
      writeFileSync(dest, karabinerRulesToJson(rules) + "\n", "utf8");
    }
    console.log("Karabiner: enable 'onering' complex modification in Karabiner-Elements if needed.");
  }

  if (d.os === "linux") {
    const body = compileKeydConf(map);
    const hasKeyd = map.super_as_command || (map.keyd_extra?.length ?? 0) > 0;
    if (!hasKeyd) {
      console.log("keyd: skipped (set super_as_command or keyd_extra in map.yaml to generate rules).");
      return;
    }
    if (dryRun) {
      console.log(`[dry-run] would write ${KEYD_TARGET} via sudo:\n${body.slice(0, 500)}…`);
    } else {
      const r = await runWithStdin("sudo", ["tee", KEYD_TARGET], body);
      if (r.code !== 0) {
        console.error(`keyd write failed: ${r.stderr}`);
        return;
      }
      const reload = await run("sudo", ["keyd", "reload"]);
      if (reload.code !== 0) {
        console.warn(`keyd reload: ${reload.stderr || reload.stdout || "try: sudo systemctl restart keyd"}`);
      } else {
        console.log("keyd configuration applied.");
      }
    }
  }
}
