/* Auto setup and start for Windows PowerShell users */
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function run(cmd, cwd = process.cwd()) {
  execSync(cmd, { stdio: 'inherit', cwd });
}

function hasNodeModules(dir) {
  return fs.existsSync(path.join(dir, 'node_modules'));
}

// Free ports 5000 and 5173
try { run('node ./scripts/free-ports.js'); } catch {}

// Install deps if missing
const root = process.cwd();
const clientDir = path.join(root, 'client');
const serverDir = path.join(root, 'server');

if (!hasNodeModules(root)) {
  try { run('npm ci'); } catch { run('npm install'); }
}
if (!hasNodeModules(clientDir)) {
  try { run('npm ci', clientDir); } catch { run('npm install', clientDir); }
}
if (!hasNodeModules(serverDir)) {
  try { run('npm ci', serverDir); } catch { run('npm install', serverDir); }
}

// Start both with concurrently
const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'dev'], {
  stdio: 'inherit',
});

// Kick off E2E after short delay
setTimeout(() => {
  try {
    const e2e = spawn(process.platform === 'win32' ? 'node.exe' : 'node', ['scripts/e2e.js'], { stdio: 'inherit' });
    e2e.on('exit', () => {});
  } catch {}
}, 4000);

child.on('exit', (code) => process.exit(code || 0));


