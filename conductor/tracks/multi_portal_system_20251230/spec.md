# Specification: Multi-Portal System & World Registry

## Overview
This track transitions the application from a single, hardcoded portal system to a dynamic, multi-portal architecture. It introduces a "World Registry" that acts as a mock server, storing portals associated with specific worlds. Users will be able to create portals dynamically, and the system will support navigating between different worlds, each containing its own set of portals.

## Functional Requirements
1.  **World Registry (Mock Server):**
    *   Implement a central data structure (Registry) that maps a `WorldID` (or URL) to a list of `Portal` objects.
    *   The initial starting area (the Lobby) will be treated as the "Hub World" within this registry.
2.  **Dynamic Portal Definition:**
    *   A Portal object must contain:
        *   `id`: Unique identifier.
        *   `position`: Vector3 coordinates relative to the world it resides in.
        *   `url`: The Marble API URL for the destination world (can be `null` for "empty" portals).
    *   Other properties (name, assets) should be derived or fetched upon interaction.
3.  **Portal Creation Workflow (Spawn Empty -> Edit):**
    *   Pressing the 'P' key spawns a new `Portal` entry in the current world with `url: null` at the player's current position.
    *   These "empty" portals are rendered as wireframes.
    *   Clicking an empty portal opens the `PortalUI` (reused/adapted).
    *   Pasting a Marble API URL and confirming populates the portal's data.
4.  **Multi-Portal Rendering:**
    *   The scene must render all portals associated with the current `WorldID` from the Registry.
    *   Each portal must function independently (hover states, triggering entry).
5.  **Scene Swap Navigation:**
    *   Entering a portal with a valid URL triggers a "Scene Swap":
        *   The current world and its portals are unloaded.
        *   The destination world is loaded based on its URL.
        *   The new world's portals are fetched from the Registry and rendered.
    *   This ensures only one world's splat/mesh and portals are active at a time.

## Non-Functional Requirements
*   **Referential Stability:** Ensure that transitioning between worlds doesn't cause WebGL context loss.
*   **State Management:** Utilize Zustand to manage the Registry (new slice) and the transition between worlds.

## Acceptance Criteria
*   The app starts in the "Hub World" with zero portals initially.
*   A user can create multiple "empty" portals by pressing 'P'.
*   Clicking an empty portal opens the UI to add a Marble URL.
*   Entering a portal correctly swaps the scene and loads the next set of portals from the Registry.
*   Returning to a previous world shows the portals previously created there.

## Out of Scope
*   Actual server-side persistence (in-memory simulation).
*   Multiplayer synchronization.
*   Portal editing/deletion beyond the initial setup.
