# Specification: Fix World Centering on Portal Entry

## Overview
When entering a portal created far from the origin, the new world does not spawn centered on the player. Instead, it appears offset by a variable distance (e.g., player at 10m, world appears 4m behind). This indicates a disconnect between the player's entry position and the new world's anchor point.

## Functional Requirements
1.  **Strict Centering:** Regardless of where a portal is placed or where the player enters it, the new world's origin (0,0,0) MUST spawn exactly at the player's X/Z coordinates.
2.  **Y-Axis Handling:** As per previous fixes, the Y-axis should likely align such that the player is on the floor (or at the portal's intended height).

## Investigation Strategy
-   **Trace Coordinates:** We need to log:
    1.  Player's Absolute Position at entry.
    2.  The calculated `newAnchor` in `Portal.tsx`.
    3.  The actual `position` prop passed to the World Group in `Scene.tsx` / `WorldContent.tsx`.
-   **Verify State Updates:** Ensure `setWorldAnchorPosition` is propagating correctly and not colliding with other state updates (like `setAssets`).

## Acceptance Criteria
-   [ ] Spawn a portal at (0,0,10). Enter it. The new world's splat should be centered on the player.
-   [ ] Spawn a portal at (10,0,0). Enter it. The new world's splat should be centered on the player.
