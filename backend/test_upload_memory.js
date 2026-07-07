const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

console.log("Iniciando server para test E11...");
const serverProcess = exec('node server.js');

setTimeout(() => {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  let body = '';

  // Crear body para 6 archivos (limite es 5)
  for (let i = 0; i < 6; i++) {
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="files"; filename="dummy${i}.mp3"\r\n`;
    body += `Content-Type: audio/mpeg\r\n\r\n`;
    // Magic bytes mp3 falso
    body += `ID3_dummy_data_${i}\r\n`;
  }
  body += `--${boundary}--\r\n`;

  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/audio/upload',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      serverProcess.kill();
      console.log(`Status Code: ${res.statusCode}`);
      if (res.statusCode === 500 && data.includes('Too many files')) {
        console.log("✅ TEST PASSED: El servidor rechazo correctamente mas de 5 archivos.");
        process.exit(0);
      } else {
        console.error(`❌ TEST FAILED: Response -> ${res.statusCode} ${data}`);
        process.exit(1);
      }
    });
  });

  req.on('error', (e) => {
    serverProcess.kill();
    console.error(`❌ TEST FAILED: ${e.message}`);
    process.exit(1);
  });

  req.write(body);
  req.end();

}, 2000);
