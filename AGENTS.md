# Repository Instructions

## Jekyll commands

- Use `./scripts/jekyll-local.sh build` for local builds.
- Use `./scripts/jekyll-local.sh serve --host 127.0.0.1 --port 4000` for local serving.
- Do not use plain `bundle exec jekyll ...` in this repo.

## Why

- `scripts/jekyll-local.sh` runs `vendor/bin/bundle _2.2.6_ exec jekyll`.
- The repo expects Bundler `2.2.6` from `Gemfile.lock`.
- The wrapper also sets repo-local gem paths under `vendor/gems`.

## Verification

- When checking page changes, prefer the wrapper script above instead of invoking Bundler directly.
