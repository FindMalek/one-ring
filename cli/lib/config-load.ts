import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { z } from "zod";
import { mapYamlSchema, type MapYaml } from "../../compilers/map-schema";
import {
  extensionEntrySchema,
  packageEntrySchema,
  profileSchema,
  type ExtensionEntry,
  type PackageEntry,
  type Profile,
} from "./schemas";

function zodArray<T extends z.ZodTypeAny>(item: T) {
  return z.array(item);
}

export function loadYamlFile<T>(path: string, parser: (raw: unknown) => T): T {
  const text = readFileSync(path, "utf8");
  const raw = yaml.load(text);
  return parser(raw);
}

export function loadProfile(configDir: string, profileName: string): Profile {
  const path = join(configDir, "profiles", `${profileName}.yaml`);
  if (!existsSync(path)) {
    throw new Error(`Profile not found: ${path}`);
  }
  return loadYamlFile(path, (raw) => profileSchema.parse(raw));
}

export function loadPackageList(configDir: string, file: string): PackageEntry[] {
  const path = join(configDir, "packages", file);
  if (!existsSync(path)) return [];
  return loadYamlFile(path, (raw) => zodArray(packageEntrySchema).parse(raw));
}

export function loadMapYaml(configDir: string): MapYaml {
  const path = join(configDir, "keyboard", "map.yaml");
  if (!existsSync(path)) {
    return mapYamlSchema.parse({});
  }
  return loadYamlFile(path, (raw) => mapYamlSchema.parse(raw));
}

export function loadExtensions(configDir: string): ExtensionEntry[] {
  const path = join(configDir, "browser", "extensions.yaml");
  if (!existsSync(path)) return [];
  return loadYamlFile(path, (raw) => zodArray(extensionEntrySchema).parse(raw));
}

export type { ExtensionEntry, PackageEntry, Profile, MapYaml };
