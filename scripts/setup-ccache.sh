#!/usr/bin/env bash
# Setup ccache symlinks for ESPHome cross-compilation toolchains.
# This allows ccache to intercept ALL compiler invocations via PATH.
#
# Usage: sudo bash scripts/setup-ccache.sh
# Or:    yarn setup-ccache

set -euo pipefail

CCACHE_BIN=$(which ccache 2>/dev/null || true)
CCACHE_DIR="/usr/lib/ccache"

if [ -z "$CCACHE_BIN" ]; then
  echo "ccache not found. Installing..."
  apt-get update -qq && apt-get install -y -qq ccache
  CCACHE_BIN=$(which ccache)
fi

echo "ccache: $CCACHE_BIN"
echo "symlink dir: $CCACHE_DIR"

mkdir -p "$CCACHE_DIR"

# Toolchain prefixes used by PlatformIO/ESP-IDF for ESP32 variants
PREFIXES=(
  xtensa-esp-elf
  xtensa-esp32-elf
  xtensa-esp32s2-elf
  xtensa-esp32s3-elf
  riscv32-esp-elf
)

SUFFIXES=(gcc g++ c++ cc)

created=0
for prefix in "${PREFIXES[@]}"; do
  for suffix in "${SUFFIXES[@]}"; do
    target="$CCACHE_DIR/${prefix}-${suffix}"
    if [ ! -L "$target" ]; then
      ln -sf "$CCACHE_BIN" "$target"
      echo "  created: ${prefix}-${suffix}"
      ((created++))
    else
      echo "  exists:  ${prefix}-${suffix}"
    fi
  done
done

echo ""
echo "Done. $created new symlinks created in $CCACHE_DIR"
echo ""
echo "ccache config:"
ccache -p | grep -E "max_size|cache_dir" || true
echo ""
echo "To increase cache size: ccache -M 10G"
echo "To verify it works, compile once then check: ccache -s"
