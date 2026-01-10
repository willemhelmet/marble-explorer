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
      .run(1.5, 0.5, -2.0, 'https://marble.worldlabs.ai/world/decf14fd-b0ea-4ce2-9ec1-c50ee2b677cd', 'https://marble.worldlabs.ai/world/ff851922-c49f-41f7-b1e1-f3b0b8e65b7b');
    
    db.prepare('INSERT INTO portals (x, y, z, from_scene, target_url) VALUES (?, ?, ?, ?, ?)')
      .run(-3.0, 1.0, 5.0, 'https://marble.worldlabs.ai/world/decf14fd-b0ea-4ce2-9ec1-c50ee2b677cd', 'https://marble.worldlabs.ai/world/another-url');

    db.prepare('INSERT INTO portals (x, y, z, from_scene, target_url) VALUES (?, ?, ?, ?, ?)')
      .run(0, 0, 0, 'https://marble.worldlabs.ai/world/other', 'https://marble.worldlabs.ai/world/decf14fd-b0ea-4ce2-9ec1-c50ee2b677cd');

    const portals = getPortalsForRoom('https://marble.worldlabs.ai/world/decf14fd-b0ea-4ce2-9ec1-c50ee2b677cd');
    
    assert.strictEqual(portals.length, 2);
    assert.strictEqual(portals[0].from_scene, 'https://marble.worldlabs.ai/world/decf14fd-b0ea-4ce2-9ec1-c50ee2b677cd');
    assert.strictEqual(portals[0].target_url, 'https://marble.worldlabs.ai/world/ff851922-c49f-41f7-b1e1-f3b0b8e65b7b');
    assert.strictEqual(portals[1].from_scene, 'https://marble.worldlabs.ai/world/decf14fd-b0ea-4ce2-9ec1-c50ee2b677cd');
    assert.strictEqual(portals[1].target_url, 'https://marble.worldlabs.ai/world/another-url');
  });

  // Cleanup
  db.close();
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
});
