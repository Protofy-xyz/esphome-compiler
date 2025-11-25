const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../../');
const envPath = path.join(repoRoot, '.env');

const nodeEnv = process.env.NODE_ENV ?? 'dev';

const defaults = {
    ESPHOME_PORT: '6052',
    ESPHOME_DASHBOARD_IMAGE: 'esphome/esphome:2025.11.1',
    ESPHOME_DASHBOARD_ADDRESS: '0.0.0.0',
    ESPHOME_BIND_ADDRESS: '127.0.0.1'
};

if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, '', 'utf8');
}

const fileContents = fs.readFileSync(envPath, 'utf8');
const existingKeys = new Set();

fileContents
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .forEach((line) => {
        const [key] = line.split('=', 1);
        if (key) {
            existingKeys.add(key.trim());
        }
    });

const linesToAppend = [];

for (const [key, value] of Object.entries(defaults)) {
    if (!existingKeys.has(key)) {
        linesToAppend.push(`${key}=${value}`);
    }
}

if (!linesToAppend.length) {
    console.log('ESPHome prepare: no default env vars needed.');
    process.exit(0);
}

const separator = fileContents.endsWith('\n') || !fileContents.length ? '' : '\n';
const output = `${separator}${linesToAppend.join('\n')}\n`;

fs.appendFileSync(envPath, output, 'utf8');

console.log('ESPHome prepare: appended defaults for', linesToAppend.join(', '));
