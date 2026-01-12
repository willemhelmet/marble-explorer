import test from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { io } from 'socket.io-client';
import fs from 'node:fs';
import path from 'path';

const DB_PATH = 'test_socket.db';
const PORT = 3001;

test('Socket Rotation Sync', async (t) => {
  // Determine paths relative to this test file
  const testDir = path.dirname(new URL(import.meta.url).pathname);
  const serverDir = path.resolve(testDir, '..');
  const serverScript = path.join(serverDir, 'server.js');
  const dbFullPath = path.join(serverDir, DB_PATH);

  if (fs.existsSync(dbFullPath)) fs.unlinkSync(dbFullPath);

  console.log('Starting server process...');
  // Start server with custom env
  const serverProcess = spawn(process.execPath, [serverScript], {
    env: { ...process.env, DB_PATH, PORT },
    cwd: serverDir,
    stdio: 'inherit' 
  });

  // Give it time to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  const client = io(`http://localhost:${PORT}`);

  await t.test('should broadcast rotation_y on create_portal', (t, done) => {
    client.on('connect', () => {
      console.log('Test client connected');
      client.emit('join_scene', 'hub');

      const portalData = {
        x: 10, y: 0, z: 10,
        rotation_y: 3.14159,
        from_scene: 'hub',
        target_url: 'http://example.com'
      };

      console.log('Emitting create_portal');
      client.emit('create_portal', portalData);
    });

    client.on('portal_added', (data) => {
      console.log('Received portal_added:', data);
      try {
        assert.strictEqual(data.rotation_y, 3.14159, 'rotation_y should match');
        client.disconnect();
        done();
      } catch (err) {
        client.disconnect();
        done(err);
      }
    });
    
    // Timeout
    setTimeout(() => {
        client.disconnect();
        // If we haven't called done yet, this might fail or hang, but node test runner handles it.
        // We can't easily fail the test from here without rejecting a promise if we used promises.
        // But with done callback, we can't easily error out unless we called done(err).
    }, 2000);
  });

  // Cleanup
  console.log('Killing server process...');
  serverProcess.kill();
  if (fs.existsSync(dbFullPath)) fs.unlinkSync(dbFullPath);
});
