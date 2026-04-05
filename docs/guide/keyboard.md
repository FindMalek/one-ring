# Keyboard and keyd

## Source: `config/keyboard/map.yaml`

- **`super_as_command`** — When `true` on Linux, OneRing generates a **keyd** config that swaps left/right Alt and Meta (Super) so thumb keys feel closer to many Mac layouts. Tune or disable per machine.
- **`keyd_extra`** — Extra `keyd` lines under `[main]` for advanced remaps.
- **`intents`** — Human-readable per-OS chords; the v0.3 Karabiner compiler emits an empty rules array (placeholders for future intent→rule generation).

## macOS (Karabiner-Elements)

- Generated rules are written to `~/.config/karabiner/assets/complex_modifications/onering.json`.
- Install Karabiner from Homebrew: `brew install --cask karabiner-elements`.
- Enable the **onering** complex modification in the Karabiner UI if you add non-empty rules later.

## Linux (keyd)

- OneRing writes **`/etc/keyd/onering.conf`** using `sudo tee`, then runs `sudo keyd reload`.
- Install keyd: `sudo apt install keyd` (Ubuntu universe / Debian).
- If `super_as_command` is `false` and `keyd_extra` is empty, OneRing **skips** writing keyd (avoids an empty `[main]` block).

## Cursor on Linux

Cursor is **not** distributed as `com.cursor.Cursor` on Flathub. Use the official Linux installer from [cursor.com](https://cursor.com/download) or encode a no-op / message command in `config/packages/apps-linux.yaml`.

## Zen Browser (Flatpak)

Use Flatpak id **`app.zen_browser.zen`** (not `io.github.zen_browser.zen`).
