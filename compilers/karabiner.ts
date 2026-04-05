import type { MapYaml } from "./map-schema";

/**
 * Produce Karabiner-Elements `complex_modifications.rules` JSON array.
 * v0.3: returns an empty array; macOS defaults cover most Cmd shortcuts. Expand later with parsed intents.
 */
export function compileKarabinerRules(map: MapYaml): unknown[] {
  void map;
  return [];
}

export function karabinerRulesToJson(rules: unknown[]): string {
  return JSON.stringify(rules, null, 2);
}
