import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { applyProfile, applyProfileFromObject } from "./apply";
import { syncRepo } from "./sync";
import { loadMapYaml } from "./lib/config-load";
import { compileKarabinerRules, karabinerRulesToJson } from "../compilers/karabiner";
import { compileKeydConf } from "../compilers/keyd";
import { profileFromWizardState } from "./wizard-state";

export async function runApply(opts: { configDir: string; profile: string; dryRun: boolean }): Promise<void> {
  await applyProfile(opts);
}

export async function runSync(opts: { configDir: string; profile: string; dryRun: boolean }): Promise<void> {
  await syncRepo(opts);
}

export async function runCompileKeyboard(opts: {
  configDir: string;
  outDir?: string;
  dryRun: boolean;
}): Promise<void> {
  const map = loadMapYaml(opts.configDir);
  const rules = compileKarabinerRules(map);
  const keyd = compileKeydConf(map);
  const out = opts.outDir;
  if (out) {
    if (!opts.dryRun) {
      mkdirSync(out, { recursive: true });
      writeFileSync(join(out, "karabiner-rules.json"), karabinerRulesToJson(rules) + "\n");
      writeFileSync(join(out, "keyd.conf"), keyd);
    }
    console.log(`Wrote ${join(out, "karabiner-rules.json")} and keyd.conf${opts.dryRun ? " (dry-run skipped)" : ""}`);
  } else {
    console.log("=== karabiner-rules.json ===");
    console.log(karabinerRulesToJson(rules));
    console.log("=== keyd.conf ===");
    console.log(keyd);
  }
}

export async function runWizard(opts: { configDir: string; dryRun: boolean }): Promise<void> {
  const { render } = await import("ink");
  const React = await import("react");
  const { WizardApp } = await import("./wizard");
  const { defaultProfileYaml } = await import("./wizard-state");

  await new Promise<void>((resolvePromise, reject) => {
    const app = render(
      React.createElement(WizardApp, {
        configDir: opts.configDir,
        dryRun: opts.dryRun,
        onDone: async (state) => {
          try {
            const profilePath = join(opts.configDir, "profiles", `${state.machine}.yaml`);
            const body = defaultProfileYaml(state);
            if (opts.dryRun) {
              console.log(`[dry-run] would write ${profilePath}\n${body}`);
            } else {
              const profDir = join(opts.configDir, "profiles");
              if (!existsSync(profDir)) mkdirSync(profDir, { recursive: true });
              writeFileSync(profilePath, body, "utf8");
              console.log(`Saved profile: ${profilePath}`);
            }
            await applyProfileFromObject({
              configDir: opts.configDir,
              profile: profileFromWizardState(state),
              dryRun: opts.dryRun,
            });
          } catch (e) {
            reject(e);
            app.unmount();
            return;
          }
          app.unmount();
          resolvePromise();
        },
        onCancel: () => {
          app.unmount();
          resolvePromise();
        },
      }),
    );
  });
}
