# Track Specification: Portal Y-Rotation Sync

## Overview
Currently, when a user enters a portal, the new world is oriented based on the user's *current* yaw direction. This causes inconsistency in multiplayer scenarios: if two users enter the same portal from different angles, the resulting world is rotated differently for each of them, breaking the shared frame of reference.

This track implements a "Central Authority" for world orientation. When a portal is created, we will capture the creator's Y-rotation (yaw). This value will be stored in the server database and sent to all clients. When any user enters that portal, their `worldAnchorOrientation` will be set to this stored value, ensuring everyone sees the world aligned exactly the same way.

## Functional Requirements

### 1. Database & Server
- **Schema Update:** Modify the `portals` table in SQLite to include a `rotation_y` (REAL) column.
- **API Update:**
    - Update `create_portal` event handler to accept `rotation_y`.
    - Update `portal_added` and `portals` event payloads to include `rotation_y`.
- **Legacy Handling:** Since this is a dev environment, we will recreate the database or allow existing portals to break/default to 0 if necessary.

### 2. Client-Side: Portal Creation
- **Capture Rotation:** In `PortalUI.tsx`, within the `handleSubmit` function, capture the current `characterStatus.quaternion` and extract the Y-axis Euler rotation (yaw).
- **Send to Server:** Pass this `rotation_y` in the `socketManager.createPortal` call alongside the position and URL.

### 3. Client-Side: Store & State
- **Type Definition:** Update `Portal` interface in `worldSlice.ts` to include `rotationY: number`.
- **Registry Update:** Update `addPortal` and `setPortalsForWorld` in `worldSlice` to handle the new field.

### 4. Client-Side: Portal Navigation
- **Entry Logic:** In `Portal.tsx`, modify `handleNavigation`:
    - **Remove:** The logic that calculates `newOrientation` based on the *current* `characterStatus.quaternion` at the moment of entry.
    - **Add:** Logic to set `worldAnchorOrientation` using the portal's stored `rotationY` (converted to a `THREE.Euler`).
- **Outcome:** Every user entering a specific portal will have their world anchor set to the exact same Y-rotation.

## Non-Functional Requirements
- **Consistency:** All clients must agree on the orientation of the world.
- **Backward Compatibility:** Not required (DB wipe is acceptable).

## Acceptance Criteria
1.  **Creation:** Creating a portal correctly saves the creator's current Yaw to the DB.
2.  **Visualization:** (Debug) inspecting the DB shows distinct `rotation_y` values for portals created at different angles.
3.  **Entry (Same User):** The creator entering their own portal sees the world oriented as they created it.
4.  **Entry (Different User/Angle):** A second user entering the same portal from a *different* angle sees the world oriented exactly the same way as the creator.
5.  **Multiplayer Sync:** Two players in the new world agree on which way is "North".

## Out of Scope
- Migrating existing portals (DB wipe is assumed).
- Pitch/Roll synchronization (Y-axis/Yaw only).
