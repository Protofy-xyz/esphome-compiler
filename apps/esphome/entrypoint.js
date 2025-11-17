const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const repoRoot = path.resolve(__dirname, '../../');
const configDir = path.join(repoRoot, 'data', 'esphome');

if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

const hostPort = Number(process.env.ESPHOME_PORT ?? 6052);
const internalPort = Number(process.env.ESPHOME_INTERNAL_PORT ?? hostPort + 1);
const basePath = normalizeBasePath(process.env.ESPHOME_BASE_PATH ?? '/esphome');
const dockerImage = process.env.ESPHOME_DASHBOARD_IMAGE ?? 'esphome/esphome:2025.3.3';
const containerName =
    process.env.ESPHOME_CONTAINER_NAME ?? `esphome-dashboard-${process.env.NODE_ENV ?? 'dev'}`;
const dashboardAddress = process.env.ESPHOME_DASHBOARD_ADDRESS ?? '0.0.0.0';

function normalizeBasePath(value) {
    if (!value || value === '/') {
        return '/';
    }
    let normalized = value.trim();
    if (!normalized.startsWith('/')) {
        normalized = `/${normalized}`;
    }
    normalized = normalized.replace(/\/+$/, '');
    return normalized || '/';
}

function shouldStripBasePath(url) {
    if (basePath === '/' || !url) {
        return false;
    }

    return (
        url === basePath ||
        url.startsWith(`${basePath}/`) ||
        url.startsWith(`${basePath}?`)
    );
}

function stripBasePath(url) {
    const currentUrl = url || '/';

    if (!shouldStripBasePath(currentUrl)) {
        return currentUrl;
    }

    const stripped = currentUrl.slice(basePath.length);

    if (!stripped) {
        return '/';
    }

    if (stripped.startsWith('?')) {
        return `/${stripped}`;
    }

    return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

const dockerArgs = [
    'run',
    '--rm',
    '--name',
    containerName,
    '-p',
    `127.0.0.1:${internalPort}:6052`,
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
    '6052'
);

console.log(
    `Starting ESPHome dashboard container ${dockerImage} on internal port ${internalPort}...`
);

const dashboardProcess = spawn('docker', dockerArgs, {
    stdio: 'inherit',
    env: process.env
});

const proxyServer = http.createServer((req, res) => {
    const targetPath = stripBasePath(req.url);
    const proxyReq = http.request(
        {
            hostname: '127.0.0.1',
            port: internalPort,
            path: targetPath,
            method: req.method,
            headers: {
                ...req.headers,
                host: `127.0.0.1:${internalPort}`
            }
        },
        (proxyRes) => {
            res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
            proxyRes.pipe(res);
        }
    );

    proxyReq.on('error', (error) => {
        if (!res.headersSent) {
            res.writeHead(502);
        }
        res.end('Failed to reach ESPHome dashboard');
        console.error('Proxy request failed', error);
    });

    req.pipe(proxyReq);
});

const closeServer = () =>
    new Promise((resolve) => {
        if (!proxyServer.listening) {
            return resolve();
        }
        proxyServer.close(resolve);
    });

proxyServer.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    console.error('Proxy client error', err);
});

proxyServer.on('error', (error) => {
    console.error('Failed to start ESPHome proxy server', error);
    dashboardProcess.kill('SIGTERM');
});

proxyServer.listen(hostPort, () => {
    const baseSuffix = basePath === '/' ? '' : basePath;
    console.log(
        `ESPHome dashboard available at http://localhost:${hostPort}${baseSuffix}`
    );
});

const forwardSignal = (signal) => {
    console.log(`Received ${signal}, shutting down ESPHome dashboard...`);
    dashboardProcess.kill(signal);
};

process.on('SIGINT', () => forwardSignal('SIGINT'));
process.on('SIGTERM', () => forwardSignal('SIGTERM'));

dashboardProcess.on('close', (code) => {
    closeServer().finally(() => {
        process.exit(code ?? 0);
    });
});

dashboardProcess.on('error', (error) => {
    console.error('Failed to start ESPHome dashboard container', error);
    closeServer().finally(() => process.exit(1));
});
