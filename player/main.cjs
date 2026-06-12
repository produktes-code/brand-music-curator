const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        backgroundColor: '#0a0a0a',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Simplificamos para MVP local
        },
        title: 'Brand Music Curator',
    });

    // En desarrollo carga de Vite, en producción del build
    const startUrl = process.env.VITE_DEV_SERVER_URL || `file://${path.join(__dirname, 'dist', 'index.html')}`;
    mainWindow.loadURL(startUrl);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

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
