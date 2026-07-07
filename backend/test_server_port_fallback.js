const net = require('net');
const { spawn } = require('child_process');
const path = require('path');

async function runTest() {
  const blocker = net.createServer();
  await new Promise((resolve) => blocker.listen(4000, resolve));

  const serverPath = path.resolve(__dirname, 'server.js');
  const serverProc = spawn('node', [serverPath], { cwd: __dirname });

  let output = '';
  const onData = (data) => {
    output += data.toString();
    console.log(data.toString());
    if (output.includes('running on port 4001') || output.includes('running on port 4001')) {
      console.log("✅ TEST PASSED: Server successfully fell back to port 4001.");
      serverProc.kill();
      blocker.close();
      process.exit(0);
    }
  };

  serverProc.stdout.on('data', onData);
  serverProc.stderr.on('data', onData);

  setTimeout(() => {
    console.error("❌ TEST FAILED: Timeout");
    serverProc.kill();
    blocker.close();
    process.exit(1);
  }, 5000);
}
runTest();
