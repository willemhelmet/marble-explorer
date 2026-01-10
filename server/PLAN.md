# Multiplayer Portal System Plan

## 1. Objective
Update the existing Socket.IO server to support persistent, user-generated portals. These portals allow players to transition between scenes ("rooms") and are stored in a local SQLite database so they persist across server restarts.

## 2. Technology Stack
*   **Database:** `better-sqlite3`
    *   *Reasoning:* High performance, simple synchronous API perfect for local file-based DBs, simplifies server logic without callback hell.
*   **Backend:** Node.js + Socket.IO (Existing)

## 3. Database Schema
We will create a single table `portals` within a new `disco.db` file.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY | Auto-incrementing unique ID. |
| `x` | REAL | X coordinate in 3D space. |
| `y` | REAL | Y coordinate in 3D space. |
| `z` | REAL | Z coordinate in 3D space. |
| `from_scene` | TEXT | The room name where this portal exists. |
| `to_scene` | TEXT | The target room name this portal leads to. |

## 4. Server Logic Updates (`server.js`)

### A. Initialization
*   Initialize `better-sqlite3` connection.
*   Run a startup query to create the `portals` table if it does not exist.

### B. Event Handling Changes

#### 1. `join_scene` (Modified)
*   **Current:** Adds player to room, emits `players` list.
*   **New:**
    *   Query DB for all portals where `from_scene` matches the new room.
    *   Emit a consolidated `room_state` event (or separate `portals` event) containing both players and portals.

#### 2. `create_portal` (New)
*   **Payload:** `{ x, y, z, from_scene, to_scene }`
*   **Action:**
    *   Validate input.
    *   `INSERT` into DB.
    *   Get the new `id`.
    *   Broadcast `portal_added` event to all sockets in `from_scene` so clients render it immediately.

#### 3. `remove_portal` (New)
*   **Payload:** `{ id, room_name }`
*   **Action:**
    *   `DELETE` from DB where `id` matches.
    *   Broadcast `portal_removed` event to all sockets in `room_name` so clients remove it.

## 5. Implementation Steps
1.  **Install Dependencies:** Run `npm install better-sqlite3`.
2.  **Database Setup:** Add DB initialization code to the top of `server.js`.
3.  **Refactor Join Logic:** Modify the `join_scene` handler to fetch and send portal data.
4.  **Add Creation Logic:** Implement `socket.on('create_portal', ...)` handler.
5.  **Add Deletion Logic:** Implement `socket.on('remove_portal', ...)` handler.
6.  **Verify:** Test using a modified client script or manual verification.
