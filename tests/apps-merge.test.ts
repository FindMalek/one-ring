import { describe, expect, test } from "bun:test";
import { mergeCatalog } from "../modules/apps";
import type { PackageEntry } from "../cli/lib/schemas";

describe("mergeCatalog", () => {
  test("merges mac and linux entries by name", () => {
    const mac: PackageEntry[] = [{ name: "Foo", mac: "brew install foo", linux: null }];
    const linux: PackageEntry[] = [{ name: "Foo", mac: null, linux: "apt install foo" }];
    const m = mergeCatalog(mac, linux);
    expect(m).toHaveLength(1);
    expect(m[0].mac).toBe("brew install foo");
    expect(m[0].linux).toBe("apt install foo");
  });
});
