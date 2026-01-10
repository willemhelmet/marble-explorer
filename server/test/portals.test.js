import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { initDB, getDB, getPortalsForRoom } from '../db.js';

test('Portal Fetching', async (t) => {
  const dbPath = './test_portals.db';
  
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const db = initDB(dbPath);

  await t.test('should return empty list when no portals exist for a room', () => {
    const portals = getPortalsForRoom('empty_room');
    assert.strictEqual(portals.length, 0);
  });

  await t.test('should return portals for a specific room', () => {
    db.prepare('INSERT INTO portals (x, y, z, from_scene, target_url) VALUES (?, ?, ?, ?, ?)')
      .run(1.5, 0.5, -2.0, 'hub', 'https://marble.worldlabs.ai/world/1');
    
    db.prepare('INSERT INTO portals (x, y, z, from_scene, target_url) VALUES (?, ?, ?, ?, ?)')
      .run(-3.0, 1.0, 5.0, 'hub', 'world-a');

    db.prepare('INSERT INTO portals (x, y, z, from_scene, target_url) VALUES (?, ?, ?, ?, ?)')
      .run(0, 0, 0, 'other_room', 'hub');

    const portals = getPortalsForRoom('hub');
    
    assert.strictEqual(portals.length, 2);
    assert.strictEqual(portals[0].from_scene, 'hub');
    assert.strictEqual(portals[0].target_url, 'https://marble.worldlabs.ai/world/1');
    assert.strictEqual(portals[1].from_scene, 'hub');
    assert.strictEqual(portals[1].target_url, 'world-a');
  });

  // Cleanup
  db.close();
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
});
