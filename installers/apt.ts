import { run } from "../cli/lib/exec";

/** Run apt-get with common non-interactive flags (caller usually prefixes sudo). */
export async function aptGet(args: string[]): Promise<{ ok: boolean; stdout: string; stderr: string }> {
  const r = await run("apt-get", ["-y", "-qq", ...args], { env: { DEBIAN_FRONTEND: "noninteractive" } });
  return { ok: r.code === 0, stdout: r.stdout, stderr: r.stderr };
}
