# Specification: Local Hub Splat Replacement

## Overview
Replace the current placeholder grid environment (the "hub") with a high-quality local Gaussian splat (`marble-explorer-lobby.spz`) to provide a more immersive starting experience.

## Functional Requirements
- **New Hub Component:** Create a dedicated `<Hub />` component in `src/components/` to manage the hub's environment assets.
- **Local Asset Loading:** Configure the `<Hub />` component to load and render `public/marble-explorer-lobby.spz` using the Spark renderer.
- **Environment Swap:** Replace the existing `<Grid />` or placeholder floor in the main scene with the new `<Hub />` component when the player is in the "hub" state.
- **Persistence:** Ensure that whenever a player returns to the hub (e.g., via a portal or reset), the lobby splat is loaded consistently.
- **Portal Compatibility:** The existing `<PortalSpawner />` and portal system must remain functional and correctly positioned within the new hub environment.

## Non-Functional Requirements
- **Performance:** Splat loading should be efficient and not block the main thread.
- **Asset Integrity:** The splat should be correctly oriented and scaled within the Three.js world coordinate system.

## Acceptance Criteria
- [ ] The grid/placeholder environment is gone.
- [ ] The `marble-explorer-lobby.spz` splat is visible upon initial load.
- [ ] The player can move around the lobby splat (WASD + Mouse).
- [ ] Portals can be spawned and interacted with while in the lobby.
- [ ] Transitioning back to the hub from a Marble API world correctly restores the lobby splat.

## Out of Scope
- Creating a custom collision mesh for the lobby (unless a simple floor collider is needed to prevent falling).
- Modifying the core `<Splat />` component used for dynamic Marble API worlds.