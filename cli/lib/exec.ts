import { execSync, spawn } from "node:child_process";

export type RunOptions = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  stdin?: "pipe" | "ignore" | "inherit";
};

export type RunResult = {
  code: number | null;
  stdout: string;
  stderr: string;
};

export async function runWithStdin(cmd: string, args: string[], input: string, options: RunOptions = {}): Promise<RunResult> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (c: Buffer) => {
      stdout += c.toString();
    });
    child.stderr?.on("data", (c: Buffer) => {
      stderr += c.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolvePromise({ code, stdout, stderr });
    });
    child.stdin?.write(input);
    child.stdin?.end();
  });
}

export async function run(cmd: string, args: string[], options: RunOptions = {}): Promise<RunResult> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      stdio: [options.stdin ?? "ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (c: Buffer) => {
      stdout += c.toString();
    });
    child.stderr?.on("data", (c: Buffer) => {
      stderr += c.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolvePromise({ code, stdout, stderr });
    });
  });
}

export function commandExists(cmd: string): boolean {
  try {
    if (process.platform === "win32") {
      execSync(`where ${cmd}`, { stdio: "ignore" });
    } else {
      execSync(`command -v -- "${cmd.replace(/"/g, '\\"')}"`, { shell: "/bin/sh", stdio: "ignore" });
    }
    return true;
  } catch {
    return false;
  }
}
