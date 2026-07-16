const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

function startServer(extraEnv = {}) {
  const proc = spawn(process.execPath, ['server.js'], {
    env: { ...process.env, ...extraEnv },
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  proc.stdout.on('data', d => process.stdout.write('[server] ' + d));
  proc.stderr.on('data', d => process.stderr.write('[server!] ' + d));
  return proc;
}
function stopServer(proc) { try { process.kill(-proc.pid, 'SIGKILL'); } catch (_) {} }

function waitForHealth(port, path, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    (function poll() {
      const req = http.get({ host: '127.0.0.1', port, path }, res => {
        let body = ''; res.on('data', c => body += c);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });
      req.on('error', () => {
        if (Date.now() - t0 > timeoutMs) reject(new Error('timeout esperando server'));
        else setTimeout(poll, 250);
      });
    })();
  });
}

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Crear un archivo viejo (48h)
const oldFile = path.join(uploadsDir, 'old_test_file.mp3');
fs.writeFileSync(oldFile, 'dummy data');
const time48hAgo = Date.now() - (48 * 60 * 60 * 1000);
fs.utimesSync(oldFile, new Date(time48hAgo), new Date(time48hAgo));

// Crear un archivo nuevo (ahora)
const newFile = path.join(uploadsDir, 'new_test_file.mp3');
fs.writeFileSync(newFile, 'dummy data');

async function main() {
  console.log("Archivos creados. Iniciando server temporalmente...");
  const serverProcess = startServer();

  try {
    // Esperar al health check para asegurar que el código de arranque y cleanup corrió
    await waitForHealth(4000, '/health/ready');
    
    // Pequeña espera para asegurar que la tarea asíncrona de limpieza de disco finalizó
    await new Promise(r => setTimeout(r, 1000));

    const oldExists = fs.existsSync(oldFile);
    const newExists = fs.existsSync(newFile);
    
    if (!oldExists && newExists) {
      console.log("✅ TEST PASSED: Archivo antiguo borrado, archivo nuevo mantenido.");
      if (fs.existsSync(newFile)) fs.unlinkSync(newFile);
      stopServer(serverProcess);  // OJO: process.exit() no ejecuta finally — matar ANTES de salir
      process.exit(0);
    } else {
      console.error(`❌ TEST FAILED: oldExists=${oldExists}, newExists=${newExists}`);
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
      if (fs.existsSync(newFile)) fs.unlinkSync(newFile);
      stopServer(serverProcess);
      process.exit(1);
    }
  } catch(e) {
    console.error(`❌ TEST FAILED: error -> ${e.message}`);
    if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    if (fs.existsSync(newFile)) fs.unlinkSync(newFile);
    stopServer(serverProcess);
    process.exit(1);
  }
}

main();
