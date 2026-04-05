#!/usr/bin/env bash
# OneRing installer — clone-from-source bootstrap (release binaries via GitHub Actions optional).
set -euo pipefail

ONERING_REPO="${ONERING_REPO:-https://github.com/findmalek/one-ring.git}"
INSTALL_DIR="${ONERING_INSTALL_DIR:-${HOME}/.local/share/onering}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required." >&2
  exit 1
fi

if ! command -v bun >/dev/null 2>&1; then
  echo "Bun is required. Install: https://bun.sh" >&2
  echo "Then re-run this script or: cd repo && bun install && bun run cli/index.ts wizard" >&2
  exit 1
fi

echo "Cloning OneRing to ${INSTALL_DIR} …"
mkdir -p "$(dirname "${INSTALL_DIR}")"
if [[ -d "${INSTALL_DIR}/.git" ]]; then
  git -C "${INSTALL_DIR}" pull --ff-only
else
  git clone --depth 1 "${ONERING_REPO}" "${INSTALL_DIR}"
fi

cd "${INSTALL_DIR}"
bun install
echo ""
echo "Run the wizard:"
echo "  cd \"${INSTALL_DIR}\" && bun run cli/index.ts wizard"
echo ""
echo "Or apply the default profile (dry-run):"
echo "  cd \"${INSTALL_DIR}\" && bun run cli/index.ts apply --profile default --dry-run"
echo ""
echo "Set ONERING_CONFIG if your config/ lives elsewhere:"
echo "  export ONERING_CONFIG=/path/to/config"
