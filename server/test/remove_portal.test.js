import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { initDB, getDB, createPortal, removePortal, getPortalsForRoom } from '../db.js';

test('Remove Portal', async (t) => {
  const dbPath = './test_remove.db';
  
  // Cleanup previous runs
  if (fs.existsSync(dbPath)) {
    try {
        getDB()?.close();
    } catch (e) {}
    fs.unlinkSync(dbPath);
  }

  initDB(dbPath);

  await t.test('should remove a portal from the database', () => {
    const portalData = {
      x: 1,
      y: 2,
      z: 3,
      from_scene: 'https://marble.worldlabs.ai/world/decf14fd-b0ea-4ce2-9ec1-c50ee2b677cd',
      target_url: 'https://marble.worldlabs.ai/world/ff851922-c49f-41f7-b1e1-f3b0b8e65b7b'
    };
    
    const id = createPortal(portalData);
    const initialPortals = getPortalsForRoom('https://marble.worldlabs.ai/world/decf14fd-b0ea-4ce2-9ec1-c50ee2b677cd');
    assert.strictEqual(initialPortals.length, 1);
    
    const result = removePortal(id);
    assert.strictEqual(result, true);
    
    const finalPortals = getPortalsForRoom('https://marble.worldlabs.ai/world/decf14fd-b0ea-4ce2-9ec1-c50ee2b677cd');
    assert.strictEqual(finalPortals.length, 0);
  });

  await t.test('should return false when trying to remove a non-existent portal', () => {
    const result = removePortal(999);
    assert.strictEqual(result, false);
  });

  // Cleanup after test
  if (fs.existsSync(dbPath)) {
    try {
      getDB()?.close();
    } catch (e) {}
    fs.unlinkSync(dbPath);
  }
});
