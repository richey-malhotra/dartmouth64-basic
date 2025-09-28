#!/usr/bin/env node
import { exec } from 'node:child_process';
import process from 'node:process';

const platform = process.platform;

if (platform === 'win32') {
  console.error('diagnose:dev currently supports macOS and Linux only.');
  process.exit(0);
}

const command = platform === 'darwin' || platform === 'linux'
  ? 'ps -Ao pid=,command='
  : null;

if (!command) {
  console.error(`Unsupported platform: ${platform}`);
  process.exit(0);
}

exec(command, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
  if (error) {
    console.error('Unable to inspect running processes.');
    console.error(stderr.trim() || error.message);
    process.exit(1);
    return;
  }

  const lines = stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const matches = lines
    .map((line) => {
      const match = line.match(/^(\d+)\s+(.*)$/);
      if (!match) return null;
      const [, pid, commandLine] = match;
      if (!commandLine.toLowerCase().includes('next dev')) return null;
      return { pid: Number(pid), command: commandLine };
    })
    .filter(Boolean);

  if (matches.length === 0) {
    console.log('No running "next dev" processes detected.');
    process.exit(0);
    return;
  }

  console.warn('Detected running "next dev" processes:');
  matches.forEach(({ pid, command }) => {
    console.warn(`• PID ${pid}: ${command}`);
  });
  console.warn('\nIf these aren\'t intentional, you can terminate them with:');
  console.warn('  kill <PID>');
  process.exit(1);
});
