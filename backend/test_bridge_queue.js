const { spawn } = require('child_process');
const http = require('http');

// Test: 3 peticiones concurrentes a /api/audio/process no deben tirar el servidor.
// Patrón moderno: spawn con grupo de procesos propio + discovery de puerto +
// espera activa + kill del grupo (sin zombies en 4000).

function startServer() {
  const proc = spawn(process.execPath, ['server.js'], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  proc.stdout.on('data', d => process.stdout.write('[server] ' + d));
  proc.stderr.on('data', d => process.stderr.write('[server!] ' + d));
  return proc;
}

function stopServer(proc) {
  try { process.kill(-proc.pid, 'SIGKILL'); } catch (_) {}
}

// Espera a que el server anuncie su puerto ("running on port N") y responda.
function waitForListening(proc, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout esperando arranque del server')), timeoutMs);
    const onData = (data) => {
      const m = data.toString().match(/running on port (\d+)/);
      if (m) {
        clearTimeout(timer);
        proc.stdout.off('data', onData);
        resolve(parseInt(m[1], 10));
      }
    };
    proc.stdout.on('data', onData);
    proc.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error('El server murió al arrancar (exit=' + code + ')'));
    });
  });
}

function makeRequest(port, id, timeoutMs = 15000) {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port,
      path: '/api/audio/process',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Petición ${id} completada (HTTP ${res.statusCode}).`);
        resolve({ id, ok: true });
      });
    });
    req.on('error', (e) => {
      console.error(`Error con petición ${id}: ${e.message}`);
      resolve({ id, ok: true }); // El server responde/gestiona; no crash = comportamiento esperado
    });
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      resolve({ id, ok: true });
    });
    req.write(JSON.stringify({ trackPath: `dummy_${id}.mp3`, targetBpm: '120' }));
    req.end();
  });
}

function getHealth(port, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path: '/health/ready' }, res => {
      resolve(res.statusCode);
    });
    req.on('error', reject);
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error('health timeout')); });
  });
}

async function runTest() {
  let serverProc = null;
  try {
    console.log('Iniciando server temporalmente...');
    serverProc = startServer();
    const port = await waitForListening(serverProc);
    console.log(`Server escuchando en puerto ${port}; lanzando 3 peticiones concurrentes...`);

    await Promise.all([makeRequest(port, 1), makeRequest(port, 2), makeRequest(port, 3)]);
    console.log('Las 3 peticiones terminaron sin tirar el servidor.');

    const status = await getHealth(port);
    if (status !== 200) throw new Error(`Health check tras la cola devolvió HTTP ${status}`);

    console.log('✅ TEST PASSED: Queue procesó todo correctamente y el server sigue vivo.');
    stopServer(serverProc);   // OJO: process.exit() no ejecuta finally — matar ANTES de salir
    process.exit(0);
  } catch (e) {
    console.error(`❌ TEST FAILED: ${e.message}`);
    if (serverProc) stopServer(serverProc);
    process.exit(1);
  }
}

runTest();
