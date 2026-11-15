// Modern Web Guidance (GoogleChrome/modern-web-guidance, Apache-2.0), pinned. Never npx or @latest: the first run
// downloads the one npm release below, checks it against its sha512, and keeps it in a cache folder; every later run is
// local and offline. Its usage reporting (a watchdog posting each query to Google) is off: DISABLE_TELEMETRY=1 is set
// before the CLI loads, and the watchdog is replaced with one that sends nothing. Moving to a new version is a
// deliberate edit here and in SKILL.md (the same pin as Clearboard's daemon/src/webguide.ts).
// Usage: node mwg.mjs <search|retrieve|list|legacy-scan> ...
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const PIN = {
  version: '1.0.0',
  integrity: 'sha512-vafIZwC8AS6QjM2yyoflZbnc7n3/TVOMLbEMRdPTwcFy0f9/Tq8s5rJQ8UIqRt2KPl9ixravyaMR4nTGuUrcmg==',
  skillVersion: '2026_11_09-5bcc021b',
};
const NAME = 'modern-web-guidance';
const win = process.platform === 'win32';
const base = process.env.MWG_CACHE ?? (win && process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'claude-skills', NAME) : join(homedir(), '.cache', 'claude-skills', NAME));
const dir = join(base, PIN.version);
const ready = join(dir, '.ready');

async function install() {
  const res = await fetch(`https://registry.npmjs.org/${NAME}/-/${NAME}-${PIN.version}.tgz`, { signal: AbortSignal.timeout(180_000) });
  if (!res.ok) throw new Error(`the npm registry answered ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const got = `sha512-${createHash('sha512').update(buf).digest('base64')}`;
  if (got !== PIN.integrity) throw new Error(`the download didn't match its pinned checksum, so it wasn't installed`);
  const tmp = `${dir}.${process.pid}.tmp`;
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  try {
    writeFileSync(join(tmp, 'p.tgz'), buf);
    // Windows' own tar (bsdtar), not Git Bash's, which reads "C:" as a remote host.
    const tar = win ? join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
    execFileSync(tar, ['-xzf', 'p.tgz'], { cwd: tmp, stdio: 'ignore', timeout: 120_000, windowsHide: true });
    const pkg = join(tmp, 'package'), src = join(pkg, 'skills', NAME), out = join(tmp, 'out');
    if (JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8')).version !== PIN.version) throw new Error('the package has the wrong version');
    if (readFileSync(join(src, 'skill-version.txt'), 'utf8').trim() !== PIN.skillVersion) throw new Error('the package has the wrong skill version');
    cpSync(src, out, { recursive: true });
    for (const f of ['LICENSE', 'THIRD_PARTY_NOTICES']) if (existsSync(join(pkg, f))) cpSync(join(pkg, f), join(out, f));
    writeFileSync(join(out, 'watchdog', 'main.js'), '// Replaced by claude-skills: usage reporting is off, so this sends nothing.\nprocess.stdin.resume();\n');
    writeFileSync(join(out, '.ready'), `${PIN.version} ${PIN.integrity}\n`);
    mkdirSync(base, { recursive: true });
    try { renameSync(out, dir); } catch (e) { if (!existsSync(ready)) throw e; }   // another run got there first
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (!existsSync(ready)) {
  try { await install(); } catch (e) {
    console.error(`modern-web-guidance ${PIN.version} couldn't be installed: ${e.message}. Carry on without it.`);
    process.exit(1);
  }
}
process.env.DISABLE_TELEMETRY = '1';
await import(pathToFileURL(join(dir, 'modern-web.mjs')).href);
