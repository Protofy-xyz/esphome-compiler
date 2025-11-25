const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const repoRoot = path.resolve(__dirname, '../../');
const configDir = path.join(repoRoot, 'data', 'esphome');

dotenv.config({ path: path.join(repoRoot, '.env') });

if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

const dashboardPort = Number(process.env.ESPHOME_PORT ?? 6052);
const dockerImage = process.env.ESPHOME_DASHBOARD_IMAGE ?? 'esphome/esphome:2025.11';
const containerName =
    process.env.ESPHOME_CONTAINER_NAME ?? `esphome-dashboard-${process.env.NODE_ENV ?? 'dev'}`;
const dashboardAddress = process.env.ESPHOME_DASHBOARD_ADDRESS ?? '0.0.0.0';
const portBindingHost = process.env.ESPHOME_BIND_ADDRESS ?? '127.0.0.1';
let shuttingDown = false;
let containerRemoved = false;

const dockerArgs = [
    'run',
    '--rm',
    '--name',
    containerName,
    '-p',
    `${portBindingHost}:${dashboardPort}:${dashboardPort}`,
    '-v',
    `${configDir}:/config`
];

if (typeof process.getuid === 'function' && typeof process.getgid === 'function') {
    dockerArgs.push('-u', `${process.getuid()}:${process.getgid()}`);
}

dockerArgs.push(
    dockerImage,
    'dashboard',
    '/config',
    '--address',
    dashboardAddress,
    '--port',
    `${dashboardPort}`
);

console.log(
    `Starting ESPHome dashboard container ${dockerImage} on http://${portBindingHost}:${dashboardPort}...`
);

const dashboardProcess = spawn('docker', dockerArgs, {
    stdio: 'inherit',
    env: process.env
});

const cleanupDockerContainer = () => {
    if (containerRemoved) {
        return;
    }

    containerRemoved = true;

    try {
        spawnSync('docker', ['rm', '-f', containerName], {
            stdio: 'ignore',
            env: process.env
        });
    } catch (error) {
        console.error('Failed to remove ESPHome container', error);
    }
};

const finalizeAndExit = (code = 0) => {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;
    cleanupDockerContainer();
    process.exit(code);
};

const forwardSignal = (signal) => {
    console.log(`Received ${signal}, shutting down ESPHome dashboard...`);

    if (dashboardProcess && dashboardProcess.exitCode === null) {
        try {
            dashboardProcess.kill('SIGTERM');
        } catch (error) {
            console.error('Failed to forward signal to dashboard process', error);
        }
    }

    finalizeAndExit(0);
};

process.on('SIGINT', () => forwardSignal('SIGINT'));
process.on('SIGTERM', () => forwardSignal('SIGTERM'));
process.on('exit', () => cleanupDockerContainer());

dashboardProcess.on('close', (code) => {
    finalizeAndExit(code ?? 0);
});

dashboardProcess.on('error', (error) => {
    console.error('Failed to start ESPHome dashboard container', error);
    finalizeAndExit(1);
});
