import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const bannerText = await readFile(
  path.join(rootDir, '_includes', 'copyright-header.txt'),
  'utf8',
);

const buildOptions = {
  absWorkingDir: rootDir,
  entryPoints: ['_js/src/index.js'],
  outfile: 'assets/js/hydejack.js',
  bundle: true,
  minify: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2015'],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  banner: {
    js: bannerText.trimEnd(),
  },
  logLevel: 'info',
};

if (process.argv.includes('--watch')) {
  const ctx = await esbuild.context({
    ...buildOptions,
    sourcemap: true,
  });

  await ctx.watch();
  console.log('Watching JS with esbuild...');
} else {
  await esbuild.build(buildOptions);
}
