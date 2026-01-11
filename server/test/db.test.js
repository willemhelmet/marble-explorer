import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { initDB, getDB } from '../db.js';

test('Database Initialization', async (t) => {
  const dbPath = './test.db';
  
  // Cleanup previous runs
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  await t.test('should initialize the database and create portals table', () => {
    initDB(dbPath);
    const db = getDB();
    
    const tableInfo = db.prepare("PRAGMA table_info(portals)").all();
    
    assert.strictEqual(tableInfo.length, 7, 'Table should have 7 columns');
    
    const columns = tableInfo.map(c => c.name);
    assert.ok(columns.includes('id'), 'Should have id column');
    assert.ok(columns.includes('x'), 'Should have x column');
    assert.ok(columns.includes('y'), 'Should have y column');
    assert.ok(columns.includes('z'), 'Should have z column');
    assert.ok(columns.includes('rotation_y'), 'Should have rotation_y column');
    assert.ok(columns.includes('from_scene'), 'Should have from_scene column');
    assert.ok(columns.includes('target_url'), 'Should have target_url column');
  });

  // Cleanup after test
  if (fs.existsSync(dbPath)) {
    try {
      getDB()?.close();
    } catch (e) {}
    fs.unlinkSync(dbPath);
  }
});
