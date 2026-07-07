const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

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

console.log("Archivos creados. Iniciando server temporalmente...");

const serverProcess = exec('node server.js');

setTimeout(() => {
  serverProcess.kill();
  
  const oldExists = fs.existsSync(oldFile);
  const newExists = fs.existsSync(newFile);
  
  if (!oldExists && newExists) {
    console.log("✅ TEST PASSED: Archivo antiguo borrado, archivo nuevo mantenido.");
    fs.unlinkSync(newFile); // limpiar
    process.exit(0);
  } else {
    console.error(`❌ TEST FAILED: oldExists=${oldExists}, newExists=${newExists}`);
    if (oldExists) fs.unlinkSync(oldFile);
    if (newExists) fs.unlinkSync(newFile);
    process.exit(1);
  }
}, 3000); // 3 segundos para que el server arranque y haga el cleanup
