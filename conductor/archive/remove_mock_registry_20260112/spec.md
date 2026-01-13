# Specification: Remove Mock Registry Data

## Overview
This track involves removing the client-side `mockRegistryData.ts` file and updating the `worldSlice` to initialize with an empty registry. The application will rely solely on the server (via `socketManager`) to populate the world registry with portals upon connection and scene joins.

## Functional Requirements
- **Remove Mock Data:** Delete `src/store/mockRegistryData.ts`.
- **Empty Initialization:** Update `src/store/worldSlice.ts` to initialize `worldRegistry` as an empty object `{}`.
- **Server Dependency:** Ensure that the `socketManager` correctly populates the registry when the `portals` event is received from the server. (Existing logic confirms this, but we rely on it now).

## Non-Functional Requirements
- **Cleanup:** Remove unused imports related to `mockRegistryData`.

## Acceptance Criteria
- [ ] `src/store/mockRegistryData.ts` is deleted.
- [ ] The application compiles without errors.
- [ ] On startup, the "hub" world loads portals from the server (if any exist in the DB) instead of the hardcoded mock portals.
- [ ] `worldRegistry` starts empty and is populated dynamically.

## Out of Scope
- Changes to server-side logic (already handles sending portals).
- Adding new default portals (unless they are in the server DB).
