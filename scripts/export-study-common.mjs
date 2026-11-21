/**
 * Build a standalone, GitHub-ready source archive from the working app.
 * Run from the repository root: node scripts/export-study-common.mjs
 * No credentials, browser data, uploaded documents or backend files are copied.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const app = path.join(root, 'artifacts/study-common');
const output = path.join(root, 'generated-artifacts/study-common');
await fs.mkdir(output, { recursive: true });

// 1. Copy application code, not dependencies or generated build output.
await fs.cp(path.join(app, 'src'), path.join(output, 'src'), { recursive: true });
await fs.copyFile(path.join(app, 'index.html'), path.join(output, 'index.html'));
await fs.mkdir(path.join(output, 'public'), { recursive: true });
try {
  const assets = await fs.readdir(path.join(app, 'public'), { withFileTypes: true });
  for (const asset of assets) {
    if (asset.name === 'downloads') continue;
    await fs.cp(path.join(app, 'public', asset.name), path.join(output, 'public', asset.name), { recursive: true });
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

// 2. Resolve workspace version aliases to normal npm package versions.
const manifest = JSON.parse(await fs.readFile(path.join(app, 'package.json'), 'utf8'));
const workspace = await fs.readFile(path.join(root, 'pnpm-workspace.yaml'), 'utf8');
const catalogSection = workspace.split('\ncatalog:\n')[1].split('\nautoInstallPeers:')[0];
const catalog = Object.fromEntries(catalogSection.split('\n').flatMap((line) => {
  const match = line.match(/^  '?([^':]+)'?: (.+)$/);
  return match ? [[match[1], match[2].replace(/^['"]|['"]$/g, '')]] : [];
}));
const dependencies = {};
for (const [name, version] of Object.entries(manifest.devDependencies)) {
  if (name.startsWith('@workspace/') || name.startsWith('@replit/')) continue;
  dependencies[name] = version === 'catalog:' ? catalog[name] : version;
  if (!dependencies[name]) throw new Error(`Missing dependency version: ${name}`);
}
dependencies.typescript = '~5.9.3';
await fs.writeFile(path.join(output, 'package.json'), JSON.stringify({
  name: 'study-common', version: '1.0.0', private: true, type: 'module',
  engines: { node: '>=22.12.0' },
  scripts: { dev: 'vite --host 0.0.0.0', build: 'tsc --noEmit && vite build', preview: 'vite preview --host 0.0.0.0', typecheck: 'tsc --noEmit' },
  devDependencies: dependencies
}, null, 2) + '\n');

// 3. Replace platform-specific configuration with portable Vite/TypeScript.
await fs.writeFile(path.join(output, 'vite.config.ts'), `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.BASE_PATH || '/',
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  server: { host: '0.0.0.0', port: 5173 },
  build: { outDir: 'dist' },
});
`);
await fs.writeFile(path.join(output, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'], module: 'ESNext',
    moduleResolution: 'Bundler', jsx: 'react-jsx', skipLibCheck: true,
    strict: true, noEmit: true, esModuleInterop: true, allowImportingTsExtensions: true,
    resolveJsonModule: true, types: ['node', 'vite/client'], paths: { '@/*': ['./src/*'] }
  }, include: ['src', 'vite.config.ts']
}, null, 2) + '\n');
await fs.writeFile(path.join(output, '.gitignore'), 'node_modules/\ndist/\n.env\n.env.*\n!.env.example\n.DS_Store\n*.tsbuildinfo\n');
await fs.writeFile(path.join(output, '.npmrc'), 'minimum-release-age=1440\n');
for (const name of ['README.md', 'CODE_GUIDE.md']) {
  await fs.copyFile(path.join(app, name), path.join(output, name));
}

// 4. Zip the standalone folder, then expose the download from the demo.
const archive = path.join(root, 'generated-artifacts/study-common-source.zip');
await fs.rm(archive, { force: true });
execFileSync('zip', ['-qr', archive, 'study-common'], { cwd: path.dirname(output) });
const downloads = path.join(app, 'public/downloads');
await fs.mkdir(downloads, { recursive: true });
await fs.copyFile(archive, path.join(downloads, 'study-common-source.zip'));
for (const name of ['README.md', 'CODE_GUIDE.md']) {
  await fs.copyFile(path.join(app, name), path.join(downloads, name));
}
console.log('Created generated-artifacts/study-common-source.zip');
