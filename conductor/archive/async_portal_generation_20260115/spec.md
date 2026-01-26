# Specification - Asynchronous Portal Generation

## Overview
Refactor the world generation process to be asynchronous and persistent. Instead of blocking the client UI during the ~5-minute generation process, the state of the operation will be stored on the `Portal` object in the database. This allows all connected clients to see the "Generating" status and ensures that the process completes even if the original creator disconnects.

## Goals
- **Non-blocking UX:** Users can close the UI and walk away while the world generates.
- **Persistent State:** The "Generating" status is synced to all users via the database.
- **Resilience:** If the creator leaves, other clients in the world can pick up the status polling.
- **Load Balancing:** Polling duties are distributed among clients to respect API rate limits using deterministic leader selection.
- **URL Correction:** Fix a known API bug where the returned URL uses `/worlds/` instead of the correct `/world/`.

## Functional Requirements

### 1. Database & Schema
- **Directory:** `../marble-explorer-server/db.js`
- The `portals` table must support two new fields:
    - `status` (TEXT): Enum-like values `['generating', 'ready', 'error']`.
    - `pending_operation_id` (TEXT): Stores the Marble API operation ID during generation.
- **Fresh Start:** The database schema will be updated in the `CREATE TABLE` definition. No migration scripts needed (wipe allowed).

### 2. Portal UI (Generate Tab)
- **Action:** Clicking "Engage" calls the `generateWorld` API.
- **Feedback:** Upon receiving the `operation_id`, the client does **not** wait.
- **Handover:** The client immediately emits an `update_portal` socket event setting:
    - `status: 'generating'`
    - `pendingOperationId: <id>`
- **Closure:** The UI modal closes immediately.

### 3. Portal Object (3D)
- **Visuals:**
    - **Generating:** Distinct visual (Blue wireframe, floating text "GENERATING WORLD...").
    - **Ready:** Existing "Enter World" / Full render.
- **Logic (Distributed Polling):**
    - **Trigger:** If a portal is in `generating` state AND has a `pendingOperationId`.
    - **Leader Selection:** To prevent all clients from polling:
        - Clients sort the list of players in the current room by socket ID.
        - A deterministic index is calculated: `index = hash(portalId) % players.length`.
        - The player at `players[index]` is the **Designated Poller** for that specific portal.
    - **Polling Action:** The Designated Poller calls `getOperation(portal.pendingOperationId)`.
    - **Frequency:** Every **15 seconds**.
    - **Completion:** When the API returns `done: true`:
        - **URL Fix:** Replace `/worlds/` with `/world/` in the result URL.
        - Emit `update_portal` with `status: 'ready'` and `url: <corrected_url>`.
    - **Error:** If API fails, emit `status: 'error'`.

## Non-Functional Requirements
- **Rate Limits:** Polling frequency set to 15 seconds.
- **Backend Location:** All backend changes must be in `../marble-explorer-server`.