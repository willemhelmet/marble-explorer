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
      rotation_y REAL NOT NULL DEFAULT 0,
      from_scene TEXT NOT NULL,
      target_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ready',
      pending_operation_id TEXT
    )
  `);

  // Migrate existing databases: add new columns if they don't exist
  try {
    db.exec(`ALTER TABLE portals ADD COLUMN status TEXT NOT NULL DEFAULT 'ready'`);
  } catch (_) { /* column already exists */ }
  try {
    db.exec(`ALTER TABLE portals ADD COLUMN pending_operation_id TEXT`);
  } catch (_) { /* column already exists */ }

  console.log(`Database initialized at ${dbPath}`);
  return db;
}

export function getPortalsForRoom(roomName) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db.prepare('SELECT * FROM portals WHERE from_scene = ?').all(roomName);
}

export function createPortal({ x, y, z, rotation_y = 0, from_scene, target_url, status = 'ready', pending_operation_id = null }) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }

  if (x === undefined || y === undefined || z === undefined || !from_scene || !target_url) {
    throw new Error('Missing required fields for portal creation');
  }

  const info = db.prepare(`
    INSERT INTO portals (x, y, z, rotation_y, from_scene, target_url, status, pending_operation_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(x, y, z, rotation_y, from_scene, target_url, status, pending_operation_id);

  return info.lastInsertRowid;
}

export function updatePortal(id, updates) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }

  const allowedColumns = ['target_url', 'status', 'pending_operation_id'];
  const setClauses = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    if (allowedColumns.includes(key)) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (setClauses.length === 0) {
    return false;
  }

  values.push(id);
  const info = db.prepare(
    `UPDATE portals SET ${setClauses.join(', ')} WHERE id = ?`
  ).run(...values);

  return info.changes > 0;
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
