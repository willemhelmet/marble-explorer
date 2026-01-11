import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { initDB, getDB, createPortal, getPortalsForRoom } from '../db.js';

test('Database Rotation Schema', async (t) => {
  const dbPath = './test_rotation.db';
  
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  // Init DB
  initDB(dbPath);
  const db = getDB();

  await t.test('should have rotation_y column in portals table', () => {
    const tableInfo = db.prepare("PRAGMA table_info(portals)").all();
    const columns = tableInfo.map(c => c.name);
    assert.ok(columns.includes('rotation_y'), 'Should have rotation_y column');
  });

  await t.test('should store and retrieve rotation_y', () => {
    const portalData = {
      x: 10.0,
      y: 0.0,
      z: 10.0,
      rotation_y: 1.57, // PI/2
      from_scene: 'hub',
      target_url: 'http://example.com'
    };

    const id = createPortal(portalData);
    
    const portals = getPortalsForRoom('hub');
    const savedPortal = portals.find(p => p.id === id);
    
    assert.ok(savedPortal, 'Portal should be saved');
    assert.strictEqual(savedPortal.rotation_y, 1.57, 'rotation_y should be preserved');
  });

  // Cleanup
  db.close();
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
});
