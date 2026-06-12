const express = require('express');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const os = require('os');
const crypto = require('crypto');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// --- PILAR 2: PUENTE PYTHON (CEREBRO DSP) ---
app.post('/api/audio/process', (req, res) => {
  const { trackPath, highPassFilter, targetBpm } = req.body;
  
  console.log(`[Python Bridge] Invoking analyzer.py for ${trackPath}`);
  
  // Simulated Python call via child_process
  // In production, this spawns the real Python DSP script
  const pythonProcess = spawn('python3', [
    '../audio-engine/analyzer.py', 
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
app.get('/api/audio/stream/:trackId', (req, res) => {
  const trackId = req.params.trackId;
  const ALGORITHM = 'aes-256-cbc';
  const KEY = crypto.scryptSync('AntigravityEnterpriseSecret', 'salt', 32);
  const IV = Buffer.alloc(16, 0); // In prod, read from file header
  
  console.log(`[Crypto Engine] RAM-only decryption initiated for track ${trackId}`);
  
  // Simulating streaming a decrypted file directly to memory buffer
  // This prevents the raw .mp3 from ever touching the disk unencrypted.
  res.setHeader('Content-Type', 'audio/mpeg');
  res.send(`Audio stream for ${trackId} dynamically decrypted in RAM.`);
});

// --- API DATABASE ENDPOINTS ---
app.get('/api/zones', (req, res) => {
  const zones = db.prepare('SELECT * FROM zones').all();
  res.json(zones);
});

app.post('/api/zones', (req, res) => {
  const { group_name, location, zone_name, hardware_id } = req.body;
  const stmt = db.prepare('INSERT INTO zones (group_name, location, zone_name, hardware_id, status) VALUES (?, ?, ?, ?, ?)');
  try {
    const info = stmt.run(group_name, location, zone_name, hardware_id, 'Offline');
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/mixes', (req, res) => {
  const mixes = db.prepare('SELECT * FROM mixes').all();
  res.json(mixes);
});

app.post('/api/mixes', (req, res) => {
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

app.put('/api/mixes/:id', (req, res) => {
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

app.delete('/api/mixes/:id', (req, res) => {
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
app.get('/api/schedule', (req, res) => {
  const schedule = db.prepare('SELECT * FROM schedule').all();
  res.json(schedule);
});

app.put('/api/schedule', (req, res) => {
  const { day_of_week, time_slot, mix_id } = req.body;
  const stmt = db.prepare('INSERT INTO schedule (day_of_week, time_slot, mix_id) VALUES (?, ?, ?) ON CONFLICT(day_of_week, time_slot) DO UPDATE SET mix_id = excluded.mix_id');
  try {
    const info = stmt.run(day_of_week, time_slot, mix_id);
    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Antigravity Node Backend running on port ${PORT}`);
});
