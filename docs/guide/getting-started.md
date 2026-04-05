# Getting started

## Requirements

- [Bun](https://bun.sh) >= 1.1
- Git
- macOS with Homebrew, or Debian/Ubuntu/Zorin with `apt` and optionally Flatpak

## From a clone

```bash
git clone <your-fork-or-repo-url> one-ring
cd one-ring
bun install
bun run cli/index.ts doctor
bun run cli/index.ts apply --profile default --dry-run
bun run cli/index.ts wizard
```

## Environment

| Variable | Meaning |
|----------|---------|
| `ONERING_CONFIG` | Absolute path to the directory that contains `profiles/`, `keyboard/`, etc. |
| `ONERING_ROOT` | Repository root; config is read from `<root>/config` |

If unset, OneRing walks up from the current working directory looking for a `config/` directory.

## Commands

| Command | Description |
|---------|-------------|
| `onering doctor` | Check platform tools (brew, apt, flatpak, keyd, …) |
| `onering wizard` | Interactive setup; writes `config/profiles/<machine>.yaml` and applies |
| `onering apply --profile <name>` | Apply a profile non-interactively |
| `onering sync [--profile <name>]` | `git pull` at repo root (if `.git` exists), then apply |
| `onering compile-keyboard [--out-dir dir]` | Print or write Karabiner rules + `keyd.conf` from `map.yaml` |

Use `--dry-run` to print planned shell commands and symlinks without changing the system.

## Install script

[`install.sh`](https://github.com/findmalek/one-ring/blob/main/install.sh) clones the repo to `~/.local/share/onering` (override with `ONERING_INSTALL_DIR`) and runs `bun install`. Set `ONERING_REPO` to your fork URL if needed.

## Security note

Review any `curl | bash` installer before running. Prefer pinned releases and checksums once you publish GitHub Releases.
