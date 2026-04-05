import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { loadProfile, loadPackageList } from "../cli/lib/config-load";

const root = join(import.meta.dir, "..");
const configDir = join(root, "config");

describe("config-load", () => {
  test("loads default profile", () => {
    const p = loadProfile(configDir, "default");
    expect(p.machine).toBe("default");
    expect(p.modules?.core).toBe(true);
  });

  test("loads core packages", () => {
    const list = loadPackageList(configDir, "core.yaml");
    expect(list.length).toBeGreaterThan(0);
    expect(list[0].name).toBeDefined();
  });
});
