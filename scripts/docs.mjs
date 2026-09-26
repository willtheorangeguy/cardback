import { cp, mkdir, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Keep aligned with ci.yml and docs-lint.yml.
const ref = 'a1dbb03a549c964821efbff190b4bd52408d1b79';
process.chdir(fileURLToPath(new URL('../', import.meta.url)));
function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8', windowsHide: true });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || `git exited ${result.status}`);
  return result.stdout.trim();
}
try {
  await access('.mkdocs-shared/shared/mkdocs.base.yml');
} catch {
  git(['clone', '--no-checkout', 'https://github.com/willtheorangeguy/mkdocs.git', '.mkdocs-shared']);
  git(['-C', '.mkdocs-shared', 'checkout', '--detach', ref]);
}
if (git(['-C', '.mkdocs-shared', 'rev-parse', 'HEAD']) !== ref) {
  throw new Error(`Shared docs checkout must be at ${ref}. Preserve local changes and update it before staging.`);
}
const source = '.mkdocs-shared/design-system';
for (const [from, to, overwrite] of [
  ['stylesheets', 'docs/stylesheets', true],
  ['javascript', 'docs/javascript', true],
  ['overrides', 'overrides', false],
  ['icons', 'overrides/.icons', false],
]) {
  await mkdir(to, { recursive: true });
  await cp(path.join(source, from), to, { recursive: true, force: overwrite });
}
await mkdir('docs/images', { recursive: true });
await cp(path.join(source, 'images/favicon.svg'), 'docs/images/favicon.svg', { force: false });
console.log(`Staged shared MkDocs design system at ${ref}.`);
