#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export GEM_HOME="${ROOT_DIR}/vendor/gems"
export GEM_PATH="${ROOT_DIR}/vendor/gems"
export BUNDLE_USER_HOME="${BUNDLE_USER_HOME:-/tmp/bundle-home}"

exec "${ROOT_DIR}/vendor/bin/bundle" _2.2.6_ exec jekyll "$@"
