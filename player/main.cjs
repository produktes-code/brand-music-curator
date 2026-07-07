const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess = null;

function startBackend() {
    const isPackaged = app.isPackaged;
    const backendPath = isPackaged 
        ? path.join(process.resourcesPath, 'backend', 'server.js')
        : path.join(__dirname, '..', 'backend', 'server.js');

    const asarNodeModules = isPackaged 
        ? path.join(process.resourcesPath, 'app.asar', 'node_modules')
        : '';

    console.log(`Starting backend server from path: ${backendPath}`);
    backendProcess = spawn(process.execPath, [backendPath], {
        cwd: path.dirname(backendPath),
        env: { 
            ...process.env, 
            ELECTRON_RUN_AS_NODE: '1',
            NODE_PATH: asarNodeModules,
            PORT: '4000',
            USER_DATA_PATH: app.getPath('userData')
        }
    });

    backendProcess.stdout.on('data', (data) => {
        console.log(`[Backend stdout]: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`[Backend stderr]: ${data}`);
    });

    backendProcess.on('close', (code) => {
        console.log(`Backend process exited with code ${code}`);
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        backgroundColor: '#0a0a0a',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        title: 'Brand Music Curator',
    });

    // En desarrollo carga de Vite, en producción del build
    const startUrl = process.env.DEV_SERVER_URL || `file://${path.join(__dirname, 'dist', 'index.html')}`;
    mainWindow.loadURL(startUrl);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    startBackend();
    createWindow();
});

app.on('will-quit', () => {
    if (backendProcess) {
        console.log('Terminating backend process...');
        backendProcess.kill();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// --- IPC MAIN COMMANDS ---

// Simular comprobación de caché local
ipcMain.on('check-cache', (event, arg) => {
    console.log("Checking local cache size...");
    // Simula que la caché está al 85% de capacidad de los 4GB
    event.reply('cache-status', { size: '3.4 GB', total: '4 GB', percentage: 85 });
});

// Simular TTS Engine (Generar Audio y guardarlo)
ipcMain.on('generate-tts', (event, { text, lang }) => {
    console.log(`Generating TTS [${lang}]: ${text}`);
    // Aquí en un futuro conectaremos la API elegida. Por ahora simulamos delay
    setTimeout(() => {
        event.reply('tts-ready', { status: 'success', text });
    }, 2000);
});
