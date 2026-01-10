import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { initDB, createPortal, getPortalsForRoom } from '../db.js';

test('Portal Creation', async (t) => {
  const dbPath = './test_create.db';
  
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const db = initDB(dbPath);

  await t.test('should create a portal and return its ID', () => {
    const portalData = {
      x: 5.0,
      y: 0.0,
      z: 5.0,
      from_scene: 'https://marble.worldlabs.ai/world/decf14fd-b0ea-4ce2-9ec1-c50ee2b677cd',
      target_url: 'https://marble.worldlabs.ai/world/ff851922-c49f-41f7-b1e1-f3b0b8e65b7b'
    };

    const id = createPortal(portalData);
    assert.ok(id, 'Should return a valid ID');
    assert.strictEqual(typeof id, 'number');

    const portals = getPortalsForRoom('https://marble.worldlabs.ai/world/decf14fd-b0ea-4ce2-9ec1-c50ee2b677cd');
    assert.strictEqual(portals.length, 1);
    assert.strictEqual(portals[0].id, id);
    assert.strictEqual(portals[0].target_url, 'https://marble.worldlabs.ai/world/ff851922-c49f-41f7-b1e1-f3b0b8e65b7b');
  });

  await t.test('should throw error for missing fields', () => {
    assert.throws(() => {
      createPortal({ x: 1, y: 1 }); // Missing required fields
    });
  });

  // Cleanup
  db.close();
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
});
