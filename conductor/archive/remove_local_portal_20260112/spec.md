# Specification: Remove Local Empty Portal

## Overview
Currently, pressing 'P' spawns a local-only "empty portal" in the world registry to mark the spot while the user enters a URL. If the user aborts, this object remains, leading to environment clutter. This track removes the intermediate local-only portal entirely. The 3D world remains untouched until the user confirms creation.

## Functional Requirements
1.  **Direct UI Trigger:** Pressing the 'create_portal' key (P) will simply open the `PortalUI` overlay. It will NOT spawn any object in the world registry.
2.  **Creation Logic (On Engage):**
    *   When the user clicks "Engage", the system will calculate the spawn parameters (1.5m in front of player, current Yaw) based on the *current* player position/rotation at that exact moment.
    *   It will then call `socketManager.createPortal` with these fresh parameters.
3.  **Removal of Cleanup Logic:**
    *   The "Abort" button no longer needs to delete a portal ID.
    *   `PortalSpawner.tsx` logic that calls `addPortal` should be removed.

## Acceptance Criteria
-   Pressing 'P' opens the Portal UI but NO sphere appears in the world.
-   Clicking "Engage" spawns a persistent portal (synced via server) at 1.5m in front of the player's position *at the moment of clicking Engage*.
-   Clicking "Abort" closes the UI with no side effects.
-   The "Empty Portal" concept is effectively removed from the client codebase.

## Out of Scope
-   Storing pending state (since we calculate on Engage).
-   Visual previews.
