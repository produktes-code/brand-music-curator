const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'antigravity.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Inicializar Tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS zones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT,
    current_energy INTEGER DEFAULT 50
  );

  CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    bpm INTEGER,
    energy_level INTEGER,
    file_path TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS ads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_name TEXT NOT NULL,
    audio_path TEXT NOT NULL,
    trigger_type TEXT -- ej: 'time', 'traffic'
  );
`);

// Insertar datos de prueba si está vacío
const zoneCount = db.prepare('SELECT COUNT(*) as count FROM zones').get().count;
if (zoneCount === 0) {
    const insertZone = db.prepare('INSERT INTO zones (name, location) VALUES (?, ?)');
    insertZone.run('Lobby Principal', 'Madrid - Gran Vía');
    insertZone.run('Zona Restaurante', 'Madrid - Gran Vía');
}

const trackCount = db.prepare('SELECT COUNT(*) as count FROM tracks').get().count;
if (trackCount === 0) {
    const insertTrack = db.prepare('INSERT INTO tracks (title, artist, bpm, energy_level, file_path) VALUES (?, ?, ?, ?, ?)');
    insertTrack.run('Deep Focus', 'Royalty Free Audio', 120, 60, '/assets/audio/deep_focus.mp3');
    insertTrack.run('Morning Coffee', 'Chill Vibes', 90, 40, '/assets/audio/morning_coffee.mp3');
    insertTrack.run('High Energy Retail', 'Antigravity Original', 128, 85, '/assets/audio/high_energy.mp3');
}

module.exports = db;
