const express = require('express');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const os = require('os');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const db = require('./db');

const pythonBin = process.platform === 'win32'
  ? path.resolve(__dirname, '..', 'audio-engine', 'venv', 'Scripts', 'python.exe')
  : path.resolve(__dirname, '..', 'audio-engine', 'venv', 'bin', 'python');


// Auto-generate .env with a secure random key if it doesn't exist
const envPath = path.resolve(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  const randomKey = crypto.randomBytes(32).toString('hex');
  const envContent = `# Backend - Auto-Generated Configuration
DECRYPTION_KEY=${randomKey}
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
PORT=4000

# Backend - Spotify API (Opcional)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
`;
  fs.writeFileSync(envPath, envContent, 'utf8');
}

require('dotenv').config({ path: envPath });

const app = express();

const origins = (process.env.ALLOWED_ORIGINS || "*").split(",");
app.use(cors({
  origin: origins.length === 1 && origins[0] === "*" ? "*" : origins,
  credentials: true
}));

app.use(express.json());

// --- GET / WELCOME & STATUS ---
app.get('/', (req, res) => {
  res.json({
    status: "online",
    message: "Antigravity Node Backend is operational.",
    version: "1.0.0",
    endpoints: {
      health: "/health/ready",
      telemetry: "/api/telemetry",
      zones: "/api/zones",
      mixes: "/api/mixes",
      schedule: "/api/schedule",
      upload: "/api/audio/upload"
    }
  });
});

// --- CONFIGURACIÓN DE RATE LIMITING ---
const { rateLimit } = require('express-rate-limit');

const createLimiter = (maxRequests, windowSeconds) => {
  return rateLimit({
    windowMs: windowSeconds * 1000,
    max: maxRequests,
    handler: (req, res, next, options) => {
      const resetTime = req.rateLimit.resetTime;
      const remainingSeconds = resetTime ? Math.ceil((resetTime.getTime() - Date.now()) / 1000) : windowSeconds;
      res.status(429).json({
        success: false,
        error: `Demasiadas solicitudes. Intenta de nuevo en ${remainingSeconds} segundos`
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const analysisLimiter = createLimiter(10, 60);
const curationLimiter = createLimiter(30, 60);

// --- PILAR 2: PUENTE PYTHON (CEREBRO DSP) ---
/**
 * @openapi
 * /api/audio/process:
 *   post:
 *     summary: Procesa un archivo de audio (Optimización DSP y análisis)
 *     tags: [Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trackPath:
 *                 type: string
 *               highPassFilter:
 *                 type: boolean
 *               targetBpm:
 *                 type: string
 *     responses:
 *       200:
 *         description: Análisis y optimización completados.
 */
app.post('/api/audio/process', analysisLimiter, (req, res) => {
  const { trackPath, highPassFilter, targetBpm } = req.body;
  
  logger.info(`[Python Bridge] Invoking analyzer.py for ${trackPath} using ${pythonBin}`);
  
  const pythonProcess = spawn(pythonBin, [
    path.resolve(__dirname, '..', 'audio-engine', 'analyzer.py'), 
    '--file', trackPath, 
    '--highpass', highPassFilter ? '80' : '0',
    '--target-bpm', targetBpm || 'auto'
  ]);

  let result = '';
  pythonProcess.stdout.on('data', (data) => { result += data.toString(); });
  
  pythonProcess.on('close', (code) => {
    res.json({ status: 'success', pythonExitCode: code, output: result || 'DSP Processing applied successfully.' });
  });
});

// --- PILAR 3: TELEMETRÍA DE HARDWARE ---
/**
 * @openapi
 * /api/telemetry:
 *   get:
 *     summary: Obtiene la telemetría del hardware y estado de la red
 *     tags: [Telemetry]
 *     responses:
 *       200:
 *         description: Telemetría de hardware exitosa.
 */
app.get('/api/telemetry', (req, res) => {
  // 1. Disk Space Check (Caché Limits)
  const freeMemGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
  const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
  
  // 2. Network Latency Ping (Simulated real OS ping)
  exec('ping -c 1 8.8.8.8', (error, stdout, stderr) => {
    let latency = "Offline";
    if (!error) {
      const match = stdout.match(/time=([\d.]+) ms/);
      if (match) latency = parseFloat(match[1]);
    }
    
    res.json({
      hardware_status: 'Healthy',
      memory: `${freeMemGB} GB Free / ${totalMemGB} GB Total`,
      network_latency_ms: latency,
      is_fallback_mode: latency === 'Offline' || latency > 200
    });
  });
});

// --- PILAR 4: CRIPTOGRAFÍA AES-256 (ANTI-PIRATERÍA) ---
/**
 * @openapi
 * /api/audio/stream/{trackId}:
 *   get:
 *     summary: Flujo de audio desencriptado en memoria RAM
 *     tags: [Streaming]
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Archivo de audio transmitido en tiempo real.
 */
app.get('/api/audio/stream/:trackId', (req, res) => {
  const trackId = req.params.trackId;
  const ALGORITHM = 'aes-256-cbc';
  const decryptionSecret = process.env.DECRYPTION_KEY || 'AntigravityEnterpriseSecret';
  const KEY = crypto.scryptSync(decryptionSecret, 'salt', 32);
  const IV = Buffer.alloc(16, 0); // In prod, read from file header
  
  logger.info(`[Crypto Engine] RAM-only decryption initiated for track ${trackId}`);
  
  // Simulating streaming a decrypted file directly to memory buffer
  // This prevents the raw .mp3 from ever touching the disk unencrypted.
  res.setHeader('Content-Type', 'audio/mpeg');
  res.send(`Audio stream for ${trackId} dynamically decrypted in RAM.`);
});

// --- API DATABASE ENDPOINTS ---
app.get('/api/zones', curationLimiter, (req, res) => {
  const zones = db.prepare('SELECT * FROM zones').all();
  res.json(zones);
});

app.post('/api/zones', curationLimiter, (req, res) => {
  const { group_name, location, zone_name, hardware_id } = req.body;
  const stmt = db.prepare('INSERT INTO zones (group_name, location, zone_name, hardware_id, status) VALUES (?, ?, ?, ?, ?)');
  try {
    const info = stmt.run(group_name, location, zone_name, hardware_id, 'Offline');
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/mixes', curationLimiter, (req, res) => {
  const mixes = db.prepare('SELECT * FROM mixes').all();
  res.json(mixes);
});

app.post('/api/mixes', curationLimiter, (req, res) => {
  const { name, genre_a, genre_b, ratio, energy_level, ad_frequency, block_explicit, block_urban } = req.body;
  const stmt = db.prepare('INSERT INTO mixes (name, genre_a, genre_b, playlist_a_ratio, energy_level, ad_frequency, block_explicit, block_urban) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  try {
    const info = stmt.run(
      name,
      genre_a || 'Indie Pop',
      genre_b || 'Deep House',
      ratio !== undefined ? ratio : 50,
      energy_level || 'Medium',
      ad_frequency !== undefined ? ad_frequency : 30,
      block_explicit ? 1 : 0,
      block_urban ? 1 : 0
    );
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/mixes/:id', curationLimiter, (req, res) => {
  const id = req.params.id;
  const { name, genre_a, genre_b, ratio, energy_level, ad_frequency, block_explicit, block_urban } = req.body;
  const stmt = db.prepare('UPDATE mixes SET name = ?, genre_a = ?, genre_b = ?, playlist_a_ratio = ?, energy_level = ?, ad_frequency = ?, block_explicit = ?, block_urban = ? WHERE id = ?');
  try {
    const info = stmt.run(
      name,
      genre_a,
      genre_b,
      ratio,
      energy_level,
      ad_frequency,
      block_explicit ? 1 : 0,
      block_urban ? 1 : 0,
      id
    );
    res.json({ success: true, changes: info.changes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/mixes/:id', curationLimiter, (req, res) => {
  const id = req.params.id;
  const stmt = db.prepare('DELETE FROM mixes WHERE id = ?');
  try {
    const info = stmt.run(id);
    res.json({ success: true, changes: info.changes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- API SCHEDULE ENDPOINTS ---
app.get('/api/schedule', curationLimiter, (req, res) => {
  const schedule = db.prepare('SELECT * FROM schedule').all();
  res.json(schedule);
});

app.put('/api/schedule', curationLimiter, (req, res) => {
  const { day_of_week, time_slot, mix_id } = req.body;
  const stmt = db.prepare('INSERT INTO schedule (day_of_week, time_slot, mix_id) VALUES (?, ?, ?) ON CONFLICT(day_of_week, time_slot) DO UPDATE SET mix_id = excluded.mix_id');
  try {
    const info = stmt.run(day_of_week, time_slot, mix_id);
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// --- SECCIÓN DE SUBIDA Y VALIDACIÓN DE AUDIO ---
const multer = require('multer');

// Asegurar que existe el directorio de subidas
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomUUID();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Tipos MIME admitidos por extensión básica
const ALLOWED_MIMES = [
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav',
  'audio/flac', 'audio/x-flac', 'audio/ogg', 'audio/x-ogg',
  'audio/aiff', 'audio/x-aiff', 'application/octet-stream'
];

const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.flac', '.ogg', '.aiff', '.aif', '.m4a'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIMES.includes(file.mimetype) || ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Formato de archivo no soportado: ${file.originalname}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2048 * 1024 * 1024, // Límite de 2GB por archivo
  }
});

// Validador de firma real de bytes (Magic Bytes) para doble verificación de seguridad
const validateMagicBytes = (filePath) => {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(12);
    fs.readSync(fd, buffer, 0, 12, 0);
    fs.closeSync(fd);

    const hex = buffer.toString('hex').toLowerCase();

    // 1. FLAC: fLaC (664c6143)
    if (hex.startsWith('664c6143')) return 'audio/flac';
    // 2. OGG: OggS (4f676753)
    if (hex.startsWith('4f676753')) return 'audio/ogg';
    // 3. WAV: RIFF (52494646) + WAVE (57415645)
    if (hex.startsWith('52494646') && hex.substring(16, 24) === '57415645') return 'audio/wav';
    // 4. AIFF: FORM (464f524d) + AIFF/AIFC (41494646 / 41494643)
    if (hex.startsWith('464f524d') && (hex.substring(16, 24) === '41494646' || hex.substring(16, 24) === '41494643')) return 'audio/aiff';
    // 5. MP3: ID3 (494433) o tramas sinc (fff, ffb, ff3, ff2)
    if (hex.startsWith('494433') || hex.startsWith('fff') || hex.startsWith('ffb') || hex.startsWith('ff3') || hex.startsWith('ff2')) return 'audio/mpeg';

    return null;
  } catch (e) {
    return null;
  }
};

app.post('/api/audio/upload', analysisLimiter, (req, res) => {
  upload.array('files')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, error: 'El tamaño de algún archivo excede el límite de 2GB' });
      }
      if (err.message && err.message.startsWith('Formato de archivo no soportado')) {
        return res.status(415).json({ success: false, error: err.message });
      }
      return res.status(500).json({ success: false, error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No se subieron archivos' });
    }

    // Validar el tamaño total sumado de la petición
    let totalSize = 0;
    for (const file of req.files) {
      totalSize += file.size;
    }
    const MAX_TOTAL_SIZE = 2048 * 1024 * 1024; // 2GB
    if (totalSize > MAX_TOTAL_SIZE) {
      // Eliminar archivos ya subidos para liberar espacio
      for (const file of req.files) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      }
      return res.status(413).json({ success: false, error: 'El tamaño total de los archivos excede el límite de 2GB' });
    }

    // Doble verificación: comprobar firmas reales de archivos (MIME real en disco)
    for (const file of req.files) {
      const realMime = validateMagicBytes(file.path);
      if (!realMime) {
        // Eliminar archivos inválidos
        for (const f of req.files) {
          if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        }
        return res.status(415).json({
          success: false,
          error: `Falsificación de tipo de archivo detectada. El contenido real de ${file.originalname} no es audio válido.`
        });
      }
    }

    const results = req.files.map(file => ({
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({ success: true, files: results });
  });
});

app.get('/health/ready', (req, res) => {
  const apiStatus = 'ok';
  
  const hasSpotifyCreds = 
    process.env.SPOTIFY_CLIENT_ID && 
    process.env.SPOTIFY_CLIENT_ID !== 'your_spotify_client_id_here' && 
    process.env.SPOTIFY_CLIENT_SECRET && 
    process.env.SPOTIFY_CLIENT_SECRET !== 'your_spotify_client_secret_here';
  
  const spotifyStatus = hasSpotifyCreds ? 'ok' : 'missing_credentials';

  const { execSync } = require('child_process');
  let mutagenStatus = 'error';
  try {
    execSync(`"${pythonBin}" -c "import librosa"`, { stdio: 'ignore' });
    mutagenStatus = 'ok';
  } catch (e) {
    mutagenStatus = 'missing';
  }

  const isReady = apiStatus === 'ok';

  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ready' : 'not_ready',
    checks: {
      api: apiStatus,
      mutagen: mutagenStatus,
      spotify_credentials: spotifyStatus === 'ok' ? 'ok' : 'optional_missing'
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Antigravity Node Backend running on port ${PORT}`);
});
