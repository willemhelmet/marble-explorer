import Database from 'better-sqlite3';

let db;

export function initDB(dbPath = 'disco.db') {
  db = new Database(dbPath);
  
  // Create portals table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS portals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      x REAL NOT NULL,
      y REAL NOT NULL,
      z REAL NOT NULL,
      from_scene TEXT NOT NULL,
      target_url TEXT NOT NULL
    )
  `);
  
  console.log(`Database initialized at ${dbPath}`);
  return db;
}

export function getPortalsForRoom(roomName) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db.prepare('SELECT * FROM portals WHERE from_scene = ?').all(roomName);
}

export function createPortal({ x, y, z, from_scene, target_url }) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  
  if (x === undefined || y === undefined || z === undefined || !from_scene || !target_url) {
    throw new Error('Missing required fields for portal creation');
  }

  const info = db.prepare(`
    INSERT INTO portals (x, y, z, from_scene, target_url)
    VALUES (?, ?, ?, ?, ?)
  `).run(x, y, z, from_scene, target_url);
  
  return info.lastInsertRowid;
}

export function removePortal(id) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  
  const info = db.prepare('DELETE FROM portals WHERE id = ?').run(id);
  return info.changes > 0;
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
}
