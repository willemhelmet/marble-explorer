# Specification: Persistent Multiplayer Portal System (Server)

## Overview
Update the Socket.IO server to support persistent, user-generated portals. These portals allow players to transition between scenes (worlds) and are stored in a local SQLite database (`disco.db`) using `better-sqlite3`.

## Functional Requirements

### 1. Database Persistence
- Use `better-sqlite3` to manage a `portals` table:
    - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
    - `x`, `y`, `z`: REAL (Coordinates mapping to the `position` in the registry)
    - `from_scene`: TEXT (The room ID where the portal exists, e.g., "hub")
    - `target_url`: TEXT (The destination, e.g., a Marble URL or another room ID)

### 2. Room State & Synchronization
- **Room Join (`join_scene`):** 
    - The server queries the DB for portals where `from_scene` matches the room.
    - Portals are sent to the client. *Note: The client will map these to the `Registry` format with `status: "ready"`.*
- **Portal Creation (`create_portal`):**
    - **Payload:** `{ x, y, z, from_scene, target_url }`.
    - **Persistence:** Save to DB and broadcast `portal_added` to all clients in `from_scene`.

### 3. Error Handling
- Emit `portal_error` to the client if the payload is invalid or DB insertion fails.

## Acceptance Criteria
- [x] Schema matches the data structure in `mockRegistryData.ts` (mapping `target_url` to `url` and `x,y,z` to `position`).
- [ ] Portals created by players persist across server restarts.
- [ ] Clients receive all existing portals for a world upon joining.
- [ ] Real-time updates: all users in a world see a new portal the moment it's created.

## Out of Scope
- **Client-side Deletion:** Portals are currently permanent.
- **User Authentication:** No "owner" tracking for portals yet.
