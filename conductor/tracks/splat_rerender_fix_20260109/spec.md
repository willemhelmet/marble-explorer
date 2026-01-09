# Specification: Prevent Unnecessary Splat Re-renders

## Overview
This track addresses a critical performance and UX issue where the Gaussian Splat scene re-renders (causing a white screen flash of 1-2 seconds) during state changes, particularly when toggling the pause menu (Escape key). The goal is to isolate the `SparkRenderer` and other heavy 3D assets from high-frequency or unrelated state updates (like `status` or `isHovered`) to ensure a stable, persistent visual experience.

## Core Problems
1.  **White Screen Flash:** The canvas disappears/flashes white when state changes occur, indicating a full unmount/remount of the WebGL context or heavy components.
2.  **Pause Menu Trigger:** Pressing 'Escape' updates the `status` store variable, which currently triggers a re-render of the scene.
3.  **Asset Reactivity:** Updates to `assets` or other store variables might be causing cascading re-renders of the entire `WorldContainer`.

## Functional Requirements
1.  **Stable Rendering:** The `SparkRenderer` and `Splat` components must *not* unmount or re-initialize when:
    -   The game is paused/unpaused (`status` changes).
    -   The UI is interacted with (`isHovered` changes).
    -   New portals are added or modified (unless they affect the current world geometry).
2.  **Asset Persistence:** Loaded assets (Splats, Colliders) must persist in memory and in the scene graph until explicitly unloaded (e.g., changing worlds).
3.  **UI Overlay:** The Pause Menu and other UI elements must render *on top* of the 3D scene without affecting the 3D scene's lifecycle.

## Technical Approach (Proposed)
1.  **Memoization:** Use `React.memo` or careful component splitting to ensure `SparkRenderer` does not re-render when parent state changes that doesn't affect it.
2.  **State Selectors:** Optimize `useMyStore` hooks to select *only* the specific data needed for each component, preventing broad re-renders.
3.  **Component Isolation:** potentially move the `SparkRenderer` into a separate component that only subscribes to `assets` and `worldAnchorPos`, decoupled from the "Game Status" logic.

## Acceptance Criteria
- [ ] Pressing 'Escape' to pause/resume does NOT cause the 3D scene to flicker, flash white, or reload.
- [ ] The Gaussian Splat remains visible and stable while the Pause Menu is open.
- [ ] Navigating between portals still correctly loads new worlds (asset swapping works).
- [ ] No regression in basic gameplay (movement, collisions).
