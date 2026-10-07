const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const backendDirectory = path.join(root, 'backend');
const environmentFile = path.join(backendDirectory, '.env');

if (!existsSync(environmentFile)) {
  console.error('Missing backend/.env. Copy backend/.env.example to backend/.env and configure your Supabase URL and secret key.');
  process.exit(1);
}

const children = [];
let stopping = false;

function stopChildren(exitCode) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) child.kill();
  }
  process.exitCode = exitCode;
}

function startNode(script, cwd, args = []) {
  const child = spawn(process.execPath, [script, ...args], { cwd, stdio: 'inherit' });
  children.push(child);
  child.on('error', error => {
    console.error(`Could not start ${script}:`, error.message);
    stopChildren(1);
  });
  child.on('exit', (code, signal) => {
    if (!stopping) {
      if (signal) console.error(`${script} stopped after signal ${signal}.`);
      stopChildren(code ?? 1);
    }
  });
}

process.on('SIGINT', () => stopChildren(0));
process.on('SIGTERM', () => stopChildren(0));

startNode(path.join(backendDirectory, 'server.js'), backendDirectory);
startNode(path.join(root, 'node_modules', '@angular', 'cli', 'bin', 'ng.js'), root, ['serve']);
