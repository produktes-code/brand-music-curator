const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

// Ensure database directory exists
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database (creates antigravity.sqlite if it doesn't exist)
const db = new Database(path.join(dbDir, 'antigravity.sqlite'), { 
  verbose: (msg) => logger.debug(msg) 
});

// Create Tables if they don't exist
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT NOT NULL,
      location TEXT NOT NULL,
      zone_name TEXT NOT NULL,
      hardware_id TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'Offline'
    );

    CREATE TABLE IF NOT EXISTS mixes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      genre_a TEXT DEFAULT 'Indie Pop',
      genre_b TEXT DEFAULT 'Deep House',
      playlist_a_ratio INTEGER DEFAULT 50,
      energy_level TEXT DEFAULT 'Medium',
      ad_frequency INTEGER DEFAULT 30,
      block_explicit BOOLEAN DEFAULT 0,
      block_urban BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_of_week TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      mix_id INTEGER,
      FOREIGN KEY (mix_id) REFERENCES mixes(id) ON DELETE SET NULL,
      UNIQUE(day_of_week, time_slot)
    );

    CREATE TABLE IF NOT EXISTS sgae_audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      hardware_id TEXT NOT NULL,
      track_id TEXT NOT NULL,
      track_title TEXT NOT NULL,
      status TEXT DEFAULT 'CERTIFIED',
      FOREIGN KEY (hardware_id) REFERENCES zones(hardware_id)
    );
  `);

  // Migrations for existing mixes table if they started prior to schema updates
  const migrations = [
    "ALTER TABLE mixes ADD COLUMN genre_a TEXT DEFAULT 'Indie Pop'",
    "ALTER TABLE mixes ADD COLUMN genre_b TEXT DEFAULT 'Deep House'",
    "ALTER TABLE mixes ADD COLUMN energy_level TEXT DEFAULT 'Medium'",
    "ALTER TABLE mixes ADD COLUMN ad_frequency INTEGER DEFAULT 30"
  ];

  for (const query of migrations) {
    try {
      db.exec(query);
      logger.info(`Migration applied: ${query}`);
    } catch (e) {
      // Ignore errors from columns already existing
    }
  }

  logger.info("Database initialized successfully. Tables verified.");
};

// Seed default data if empty
const seedData = () => {
  const checkZones = db.prepare('SELECT COUNT(*) as count FROM zones').get();
  
  if (checkZones.count === 0) {
    logger.info("Seeding initial data...");
    
    const insertZone = db.prepare('INSERT INTO zones (group_name, location, zone_name, hardware_id, status) VALUES (?, ?, ?, ?, ?)');
    insertZone.run('Iberian Peninsula', 'Madrid Serrano', 'Main Sales Floor', 'FBX-88A-921', 'Online');
    insertZone.run('Iberian Peninsula', 'Barcelona Gràcia', 'Main Sales Floor', 'FBX-BCN-114', 'Offline');

    const insertMix = db.prepare('INSERT INTO mixes (name, genre_a, genre_b, playlist_a_ratio, energy_level, ad_frequency, block_explicit, block_urban) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const res1 = insertMix.run('Brand Core Daytime', 'Indie Pop', 'Chillout', 70, 'Medium', 30, 1, 0);
    const res2 = insertMix.run('Evening Rush Hour', 'Deep House', 'Soul', 30, 'High', 15, 0, 0);
    const res3 = insertMix.run('Pre-Opening Staff Mix', 'Rock', 'Indie Pop', 50, 'Medium', 60, 0, 0);
    const res4 = insertMix.run('Closing Sweep', 'Clásica', 'Blues', 90, 'Low', 45, 1, 1);

    const m1_id = res1.lastInsertRowid;
    const m2_id = res2.lastInsertRowid;
    const m3_id = res3.lastInsertRowid;
    const m4_id = res4.lastInsertRowid;

    // Seed visual Dayparting schedule mapping
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const slots = ['Mañana', 'Mediodía', 'Tarde', 'Noche/Cierre'];
    const insertSchedule = db.prepare('INSERT OR IGNORE INTO schedule (day_of_week, time_slot, mix_id) VALUES (?, ?, ?)');

    for (const d of days) {
      insertSchedule.run(d, 'Mañana', m3_id); // Pre-opening
      insertSchedule.run(d, 'Mediodía', m1_id); // Core daytime
      insertSchedule.run(d, 'Tarde', m2_id); // Rush hour
      insertSchedule.run(d, 'Noche/Cierre', m4_id); // Closing
    }

    const insertAudit = db.prepare('INSERT INTO sgae_audit_log (hardware_id, track_id, track_title) VALUES (?, ?, ?)');
    insertAudit.run('FBX-88A-921', 'RF-101', 'Corporate Calm');
    insertAudit.run('FBX-BCN-114', 'RF-102', 'Retail Focus');

    logger.info("Database seeded successfully.");
  } else {
    logger.info(`Database already contains ${checkZones.count} zones. Skipping seed.`);
  }
};

// Initialize and seed
initDb();
seedData();

// Export the database connection for the backend server
module.exports = db;
