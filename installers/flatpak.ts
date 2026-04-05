import { run } from "../cli/lib/exec";

export async function flatpak(args: string[]): Promise<{ ok: boolean; stdout: string; stderr: string }> {
  const r = await run("flatpak", args);
  return { ok: r.code === 0, stdout: r.stdout, stderr: r.stderr };
}
