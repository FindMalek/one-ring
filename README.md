# OneRing

**One config to rule them all.** Cross-platform dotfiles manager and machine bootstrap CLI: macOS (Homebrew, Karabiner-Elements) and Debian-family Linux (apt, Flatpak, [keyd](https://github.com/rvaiya/keyd)).

## Quick start

```bash
bun install
bun run cli/index.ts doctor
bun run cli/index.ts apply --profile default --dry-run
bun run cli/index.ts wizard
```

## Repo layout

- `cli/` — entrypoint, `doctor`, `wizard` (Ink), `apply`, `sync`, `compile-keyboard`
- `compilers/` — `map.yaml` → Karabiner JSON + `keyd.conf`
- `installers/` — thin `brew` / `apt-get` / `flatpak` wrappers
- `modules/` — core packages, terminal symlinks, keyboard, IDE, apps, browser helpers
- `config/` — **your** keyboard map, terminal files, IDE JSON, package YAML, profiles
- `docs/` — VitePress site (`bun run docs:dev`)

## Commands

| Command | Description |
|---------|-------------|
| `doctor` | Check OS tools |
| `wizard` | Interactive setup + profile file |
| `apply --profile <name>` | Apply profile |
| `sync` | `git pull` + apply |
| `compile-keyboard` | Print/write compiled keyboard configs |

Global flags: `--dry-run` where supported.

## Environment

- **`ONERING_CONFIG`** — Path to the directory containing `profiles/`, `keyboard/`, etc.
- **`ONERING_ROOT`** — Repo root; config read from `<root>/config`.

## Build a single binary

```bash
bun build ./cli/index.ts --compile --outfile onering
```

Cross-compile example: `bun build ./cli/index.ts --compile --target=bun-linux-x64 --outfile onering-linux`.

## Install script

See [`install.sh`](./install.sh): clones the repo (default `~/.local/share/onering`) and runs `bun install`. Override with `ONERING_REPO` / `ONERING_INSTALL_DIR`.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs tests and compiles artifacts on Ubuntu and macOS.

## Docs

Full documentation: `bun run docs:dev` or read [`docs/guide/getting-started.md`](docs/guide/getting-started.md).
