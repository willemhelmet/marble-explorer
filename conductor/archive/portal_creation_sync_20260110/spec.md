# Portal Creation Sync Spec

## Context
We have a working multiplayer movement system. Portal creation uses a "temporary local portal" that becomes "persistent global portal" upon confirmation. The user reports that broadcasting is not working.

## Requirements

### 1. Client-Server Protocol
- **Event:** `create_portal` (Client -> Server)
  - Payload: `{ x, y, z, from_scene, target_url }`
- **Event:** `portal_added` (Server -> Client Broadcast)
  - Payload: `{ id, x, y, z, from_scene, target_url }`

### 2. Server Logic
- Validate input.
- Insert into `portals` table (SQLite).
- Emit `portal_added` to `io.to(from_scene)`.

### 3. Client Logic
- **Sender:**
  - Emits `create_portal`.
  - Removes local temporary portal immediately (to prevent duplicates).
- **Receiver (All Clients):**
  - Listen for `portal_added`.
  - Check if `from_scene` matches `currentWorldId`.
  - Add to `WorldRegistry`.

## Current State Analysis
- `server.js` seems to implement the logic.
- `SocketManager.ts` seems to implement the logic.
- `PortalUI.tsx` calls the logic.

## Potential Failure Points
- `currentWorldId` mismatch (e.g. client thinks "world-1", server thinks "hub").
- Socket connection not established when creating.
- Database write failure (permissions?).
- Coordinates serialized incorrectly.
