# Plan: Persistent Multiplayer Portal System (Server)

## Phase 1: Environment & Database Setup [checkpoint: 1fda1c4]
- [x] Task: Install `better-sqlite3` dependency in the server directory f352a98
- [x] Task: Initialize SQLite database (`disco.db`) and create `portals` table on server startup f82eb21
- [x] Task: Conductor - User Manual Verification 'Environment & Database Setup' (Protocol in workflow.md) 1fda1c4

## Phase 2: Room State & Portal Fetching [checkpoint: 37725f6]
- [x] Task: Implement unit tests for fetching portals from DB during `join_scene` 5f83b3a
- [x] Task: Update `join_scene` handler to query DB and include portal data in the response 207a2bd
- [x] Task: Conductor - User Manual Verification 'Room State & Portal Fetching' (Protocol in workflow.md) 37725f6

## Phase 3: Portal Creation & Broadcasting
- [x] Task: Implement unit tests for `create_portal` event (validation, persistence, and broadcast) b9d2309
- [~] Task: Implement `create_portal` handler with input validation and DB insertion
- [~] Task: Implement broadcasting of `portal_added` to relevant clients
- [ ] Task: Conductor - User Manual Verification 'Portal Creation & Broadcasting' (Protocol in workflow.md)

## Phase 4: Error Handling & Persistence Check
- [ ] Task: Implement unit tests for `portal_error` event on invalid inputs
- [ ] Task: Implement error catch blocks for DB operations to emit `portal_error`
- [ ] Task: Verify end-to-end persistence (Portals survive server restart)
- [ ] Task: Conductor - User Manual Verification 'Error Handling & Persistence Check' (Protocol in workflow.md)
