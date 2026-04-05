import { run } from "../cli/lib/exec";

export async function brew(args: string[]): Promise<{ ok: boolean; stdout: string; stderr: string }> {
  const r = await run("brew", args);
  return { ok: r.code === 0, stdout: r.stdout, stderr: r.stderr };
}
