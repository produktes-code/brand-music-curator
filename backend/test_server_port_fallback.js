const net = require('net');
const { spawn } = require('child_process');
const path = require('path');

function stopServer(proc) { try { process.kill(-proc.pid, 'SIGKILL'); } catch (_) {} }

async function runTest() {
  const blocker = net.createServer();
  await new Promise((resolve) => blocker.listen(4000, resolve));

  const serverPath = path.resolve(__dirname, 'server.js');
  const serverProc = spawn('node', [serverPath], {
    cwd: __dirname,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let output = '';
  const onData = (data) => {
    output += data.toString();
    console.log(data.toString());
    
    // Buscar la línea de inicialización del puerto y comprobar que no sea 4000
    const match = output.match(/running on port (\d+)/);
    if (match) {
      const port = parseInt(match[1], 10);
      if (port !== 4000) {
        console.log(`✅ TEST PASSED: Server successfully fell back to port ${port}.`);
        stopServer(serverProc);
        blocker.close();
        process.exit(0);
      }
    }
  };

  serverProc.stdout.on('data', onData);
  serverProc.stderr.on('data', onData);

  setTimeout(() => {
    console.error("❌ TEST FAILED: Timeout");
    stopServer(serverProc);
    blocker.close();
    process.exit(1);
  }, 10000);
}
runTest();
