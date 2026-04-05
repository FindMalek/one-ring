import { readFileSync, existsSync } from "node:fs";

export type OSType = "darwin" | "linux" | "unsupported";

export type LinuxDistroInfo = {
  id: string;
  idLike: string[];
  name: string;
  prettyName: string;
};

export type DetectResult = {
  os: OSType;
  /** macOS: e.g. "darwin"; Linux: kernel from uname */
  platform: string;
  arch: string;
  /** Set on Linux when /etc/os-release exists */
  linux?: LinuxDistroInfo;
};

function parseOsRelease(content: string): LinuxDistroInfo {
  const lines = content.split("\n");
  const map = new Map<string, string>();
  for (const line of lines) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    map.set(m[1], v);
  }
  const idLikeRaw = map.get("ID_LIKE") ?? "";
  const idLike = idLikeRaw.split(/\s+/).filter(Boolean);
  return {
    id: map.get("ID") ?? "linux",
    idLike,
    name: map.get("NAME") ?? "",
    prettyName: map.get("PRETTY_NAME") ?? map.get("NAME") ?? "",
  };
}

export function detect(): DetectResult {
  const platform = process.platform;
  const arch = process.arch;

  if (platform === "darwin") {
    return { os: "darwin", platform: "darwin", arch };
  }

  if (platform === "linux") {
    let linux: LinuxDistroInfo | undefined;
    const path = "/etc/os-release";
    if (existsSync(path)) {
      try {
        linux = parseOsRelease(readFileSync(path, "utf8"));
      } catch {
        linux = undefined;
      }
    }
    return { os: "linux", platform: "linux", arch, linux };
  }

  return { os: "unsupported", platform, arch };
}

export function isDebianFamily(info: DetectResult): boolean {
  if (info.os !== "linux" || !info.linux) return false;
  const { id, idLike } = info.linux;
  if (id === "ubuntu" || id === "debian" || id === "zorin") return true;
  return idLike.some((x) => x === "debian" || x === "ubuntu");
}
