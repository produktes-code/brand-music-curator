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
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.checks && parsed.checks.spotify_credentials !== 'checking') {
              resolve({ status: res.statusCode, body });
            } else {
              if (Date.now() - t0 > timeoutMs) reject(new Error('timeout esperando status final de spotify'));
              else setTimeout(poll, 250);
            }
          } catch(e) {
            if (Date.now() - t0 > timeoutMs) reject(new Error('timeout esperando JSON valido'));
            else setTimeout(poll, 250);
          }
        });
      });
      req.on('error', () => {
        if (Date.now() - t0 > timeoutMs) reject(new Error('timeout esperando server'));
        else setTimeout(poll, 250);
      });
    })();
  });
}

async function main() {
  console.log("Iniciando server con Spotify credentials falsas...");
  const serverProcess = startServer({
    SPOTIFY_CLIENT_ID: 'fake_client_id_123',
    SPOTIFY_CLIENT_SECRET: 'fake_client_secret_123'
  });

  try {
    const res = await waitForHealth(4000, '/health/ready');
    const json = JSON.parse(res.body);
    if (json.status === 'degraded' && json.checks.spotify_credentials === 'invalid_credentials') {
      console.log("✅ TEST PASSED: El health check devolvio 'degraded' debido a credenciales de Spotify invalidas.");
      stopServer(serverProcess);  // OJO: process.exit() no ejecuta finally — matar ANTES de salir
      process.exit(0);
    } else {
      console.error(`❌ TEST FAILED: Response was ${res.body}`);
      stopServer(serverProcess);
      process.exit(1);
    }
  } catch(e) {
    console.error(`❌ TEST FAILED: error -> ${e.message}`);
    stopServer(serverProcess);
    process.exit(1);
  }
}

main();
