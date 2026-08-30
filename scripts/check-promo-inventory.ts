import { spawn } from 'node:child_process';

const threshold = Number(process.env.PROMO_CODE_LOW_STOCK_THRESHOLD ?? '25');
if (!Number.isInteger(threshold) || threshold < 0) throw new Error('PROMO_CODE_LOW_STOCK_THRESHOLD must be a non-negative integer.');

const query = `SELECT platform, COUNT(*) AS available FROM promo_codes WHERE status = 'available' AND expires_at > datetime('now') GROUP BY platform;`;
const child = spawn(
  'npx',
  ['wrangler', 'd1', 'execute', 'white-goat-migration', '--remote', '--command', query],
  { stdio: 'inherit', shell: process.platform === 'win32' },
);
child.on('exit', (code) => {
  if (code !== 0) process.exitCode = 1;
  process.stdout.write(`Low-stock threshold: ${threshold}\n`);
});
