# Implementation Plan - Asynchronous Portal Generation

## Phase 1: Server-Side Schema & Logic
- [x] Task: Update Database Schema [5df5ead]
    - [x] Update `../marble-explorer-server/db.js` `initDB` to include `status` and `pending_operation_id` columns in the `CREATE TABLE` statement.
- [x] Task: Implement `updatePortal` in Server [7fc867a]
    - [x] Create `updatePortal` function in `../marble-explorer-server/db.js`.
    - [x] Add `socket.on('update_portal', ...)` handler in `../marble-explorer-server/server.js` to broadcast changes.
- [ ] Task: Conductor - User Manual Verification 'Server-Side Schema & Logic' (Protocol in workflow.md)

## Phase 2: Client-Side Refactor (UI)
- [x] Task: Refactor `GenerateTab.tsx` [896c303]
    - [x] Remove local polling logic.
    - [x] Update `handleSubmit` to:
        - Call `generateWorld` to get operation ID.
        - Emit `update_portal` socket event immediately.
        - Close the Portal UI.
    - [x] Add `updatePortal` action to `socketManager.ts`.
- [x] Task: Update `Portal.tsx` Visuals [9e1a2b3]
    - [x] Update `getStatusColor` and `getStatusText` to handle the `generating` state explicitly.
    - [x] Remove `idle` state usage.
- [x] Task: Conductor - User Manual Verification 'Client-Side Refactor (UI)' (Protocol in workflow.md)

## Phase 3: Client-Side Distributed Polling
- [x] Task: Implement "Leader-Based Polling" in `Portal.tsx` [2f4a5b6]
    - [x] Implement `isDesignatedPoller(portalId, players, myId)` helper.
    - [x] Add a polling mechanism that runs ONLY when `portal.status === 'generating'` AND `isDesignatedPoller` is true.
    - [x] Implement the polling function: calls `getOperation`.
    - [x] Logic:
        - If `done === true`:
            - **Fix URL:** Replace `/worlds/` with `/world/` in the result URL.
            - Emit `update_portal` (status: 'ready', url: corrected_url).
        - If `error`: Emit `update_portal` (status: 'error').
    - [x] Set polling interval to **15 seconds**.
- [x] Task: Conductor - User Manual Verification 'Client-Side Distributed Polling' (Protocol in workflow.md)
