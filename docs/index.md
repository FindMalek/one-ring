---
layout: home

hero:
  name: OneRing
  text: One config to rule them all
  tagline: Cross-platform dotfiles, keyboard translation, and machine bootstrap
  actions:
    - theme: brand
      text: Getting started
      link: /guide/getting-started
---

## Features

- **Single repo** — CLI plus your `config/` tree (keyboard, terminal, IDE, packages, profiles).
- **macOS + Linux** — Homebrew / Karabiner on Mac; apt, Flatpak, and **keyd** on Debian-family Linux.
- **Keyboard** — `map.yaml` compiles to Karabiner JSON (macOS) and `keyd` config (Linux). Linux writes to `/etc/keyd/onering.conf` and requires `sudo`.
- **Profiles** — `onering wizard` then `onering apply --profile <name>`; `onering sync` runs `git pull` and re-applies.
