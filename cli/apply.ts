import { detect } from "./detect";
import {
  loadExtensions,
  loadPackageList,
  loadProfile,
} from "./lib/config-load";
import type { Profile } from "./lib/schemas";
import { applyCorePackages } from "../modules/core-packages";
import { applyTerminal } from "../modules/terminal";
import { applyKeyboard } from "../modules/keyboard";
import { applyIde } from "../modules/ide";
import { applyBrowserExtensions } from "../modules/browser";
import { installApps, mergeCatalog } from "../modules/apps";

export type ApplyOptions = {
  configDir: string;
  profile: string;
  dryRun: boolean;
};

export type ApplyFromProfileOptions = {
  configDir: string;
  profile: Profile;
  dryRun: boolean;
};

function moduleFlag(
  profile: Profile,
  key: keyof NonNullable<Profile["modules"]>,
  defaultTrue = true,
): boolean {
  const v = profile.modules?.[key];
  return v === undefined ? defaultTrue : Boolean(v);
}

export async function applyProfileFromObject(opts: ApplyFromProfileOptions): Promise<void> {
  const d = detect();
  if (d.os === "unsupported") {
    throw new Error(`Unsupported OS: ${d.platform}`);
  }

  const { profile } = opts;

  if (moduleFlag(profile, "core")) {
    const core = loadPackageList(opts.configDir, "core.yaml");
    await applyCorePackages(core, d, opts.dryRun);
  }

  if (moduleFlag(profile, "terminal")) {
    applyTerminal(opts.configDir, opts.dryRun);
  }

  if (moduleFlag(profile, "keyboard")) {
    await applyKeyboard(opts.configDir, d, opts.dryRun);
  }

  if (moduleFlag(profile, "ide")) {
    await applyIde(opts.configDir, d, opts.dryRun);
  }

  if (moduleFlag(profile, "apps")) {
    const mac = loadPackageList(opts.configDir, "apps-mac.yaml");
    const linux = loadPackageList(opts.configDir, "apps-linux.yaml");
    const catalog = mergeCatalog(mac, linux);
    await installApps(catalog, profile.selected_apps ?? [], d, opts.dryRun);
  }

  if (moduleFlag(profile, "browser", false)) {
    const ext = loadExtensions(opts.configDir);
    applyBrowserExtensions(ext, d, opts.dryRun);
  }
}

export async function applyProfile(opts: ApplyOptions): Promise<void> {
  const data = loadProfile(opts.configDir, opts.profile);
  await applyProfileFromObject({ configDir: opts.configDir, profile: data, dryRun: opts.dryRun });
}
