# Plan: Persistent Multiplayer Portal System (Server)

## Phase 1: Environment & Database Setup
- [x] Task: Install `better-sqlite3` dependency in the server directory f352a98
- [ ] Task: Initialize SQLite database (`disco.db`) and create `portals` table on server startup
- [ ] Task: Conductor - User Manual Verification 'Environment & Database Setup' (Protocol in workflow.md)

## Phase 2: Room State & Portal Fetching
- [ ] Task: Implement unit tests for fetching portals from DB during `join_scene`
- [ ] Task: Update `join_scene` handler to query DB and include portal data in the response
- [ ] Task: Conductor - User Manual Verification 'Room State & Portal Fetching' (Protocol in workflow.md)

## Phase 3: Portal Creation & Broadcasting
- [ ] Task: Implement unit tests for `create_portal` event (validation, persistence, and broadcast)
- [ ] Task: Implement `create_portal` handler with input validation and DB insertion
- [ ] Task: Implement broadcasting of `portal_added` to relevant clients
- [ ] Task: Conductor - User Manual Verification 'Portal Creation & Broadcasting' (Protocol in workflow.md)

## Phase 4: Error Handling & Persistence Check
- [ ] Task: Implement unit tests for `portal_error` event on invalid inputs
- [ ] Task: Implement error catch blocks for DB operations to emit `portal_error`
- [ ] Task: Verify end-to-end persistence (Portals survive server restart)
- [ ] Task: Conductor - User Manual Verification 'Error Handling & Persistence Check' (Protocol in workflow.md)
