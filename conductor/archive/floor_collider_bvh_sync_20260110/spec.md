# Specification: Fix Floor Collider BVH Sync on Portal Entry

## Overview
Players fall through the floor after multiple portal traversals or long-distance travel. The root cause is likely that the `StaticCollider` (from `bvhecctrl`) and the `Bvh` component (from `@react-three/drei`) do not automatically react to position updates of their children after the initial mount. As a result, the physics collider remains at the original coordinates while the visual mesh moves to the new `worldAnchorPosition`.

## Functional Requirements
1.  **Forced Collider Re-initialization:** The system must force the `StaticCollider` and `Bvh` components to unmount and remount (or re-compute) whenever the `worldAnchorPosition` changes to ensure the physics body is created at the correct new location.
2.  **Persistent Grounding:** The player must remain solidly grounded on the floor collider after entering any portal, regardless of the world's coordinate offset.
3.  **Position Synchronization:** The visual floor and the physics floor must be perfectly aligned.

## Technical Strategy
-   **Key-based Remounting:** Utilize React's `key` prop on the `FloorCollider` (or its internal wrappers) using the `worldAnchorPosition` or `currentWorldId`. This will force React to tear down the old collider and create a fresh one at the new coordinates, triggering a new BVH computation and physics body generation.

## Acceptance Criteria
-   [ ] **Sequential Portal Traversal:** Entering 3+ portals in sequence (e.g., Hub -> World A -> World B -> World C) maintains a solid floor.
-   [ ] **Long-Distance Jump:** Entering a portal that spawns the world at (5000, 0, 5000) results in a functional floor.
-   [ ] **Code Verification:** The `FloorCollider` component explicitly handles updates when the anchor changes (e.g., via a `key` prop).

## Out of Scope
-   Dynamic terrain generation (we are only fixing the flat floor plane).
