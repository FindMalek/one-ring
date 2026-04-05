import { describe, expect, test } from "bun:test";
import { compileKarabinerRules, karabinerRulesToJson } from "../compilers/karabiner";
import { compileKeydConf } from "../compilers/keyd";
import { mapYamlSchema } from "../compilers/map-schema";

describe("mapYamlSchema", () => {
  test("parses minimal map", () => {
    const m = mapYamlSchema.parse({ super_as_command: false });
    expect(m.super_as_command).toBe(false);
  });
});

describe("compileKeydConf", () => {
  test("emits swap when super_as_command", () => {
    const m = mapYamlSchema.parse({ super_as_command: true });
    const conf = compileKeydConf(m);
    expect(conf).toContain("leftalt = leftmeta");
    expect(conf).toContain("leftmeta = leftalt");
  });

  test("omits swap when disabled", () => {
    const m = mapYamlSchema.parse({ super_as_command: false, keyd_extra: [] });
    const conf = compileKeydConf(m);
    expect(conf).not.toContain("leftalt = leftmeta");
  });
});

describe("compileKarabinerRules", () => {
  test("returns JSON array string", () => {
    const m = mapYamlSchema.parse({});
    const json = karabinerRulesToJson(compileKarabinerRules(m));
    expect(json.trim()).toBe("[]");
  });
});
