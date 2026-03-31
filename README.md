# Local Run

This project is a Jekyll site based on Hydejack.

## Requirements

- Ruby 2.6.x
- Node.js is optional for local serving

## Serve locally

Use the wrapper script:

```bash
./scripts/jekyll-local.sh serve --host 127.0.0.1 --port 4000
```

Then open `http://127.0.0.1:4000`.

## Build locally

```bash
./scripts/jekyll-local.sh build
```

## Notes

- Ruby gems are installed under `vendor/`.
- `.bundle/` and `vendor/` are ignored from git.
- Frontend assets are already committed, so Node.js is not required just to run the site locally.
- Frontend asset bundling uses `esbuild`.
- The esbuild bundle currently targets `es2015`, not `es5`.

## JS tasks

Install JS dependencies:

```bash
npm install
```

Build the JS bundle:

```bash
npm run build:js
```

Watch JS sources:

```bash
npm run watch:js
```

Run the JS lint task:

```bash
npm run lint:js
```

Technical notes for this project are documented in `docs/PROJECT_TECHNICAL_OVERVIEW.md`.
