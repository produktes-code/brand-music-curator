const { exec } = require('child_process');
const http = require('http');

console.log("Iniciando server con Spotify credentials falsas...");
// Establecemos variables de entorno invalidas (pero que pasen la comprobacion de "your_spotify_client_id_here")
const env = Object.assign({}, process.env, {
  SPOTIFY_CLIENT_ID: 'fake_client_id_123',
  SPOTIFY_CLIENT_SECRET: 'fake_client_secret_123'
});

const serverProcess = exec('node server.js', { env });

setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/health/ready',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      serverProcess.kill();
      try {
        const json = JSON.parse(data);
        if (json.status === 'degraded' && json.checks.spotify_credentials === 'invalid_credentials') {
          console.log("✅ TEST PASSED: El health check devolvio 'degraded' debido a credenciales de Spotify invalidas.");
          process.exit(0);
        } else {
          console.error(`❌ TEST FAILED: Response was ${data}`);
          process.exit(1);
        }
      } catch(e) {
        console.error(`❌ TEST FAILED: JSON parse error -> ${data}`);
        process.exit(1);
      }
    });
  });

  req.on('error', (e) => {
    serverProcess.kill();
    console.error(`❌ TEST FAILED: Error peticion -> ${e.message}`);
    process.exit(1);
  });

  req.end();
}, 2000); // 2 seg para que el server arranque y valide
