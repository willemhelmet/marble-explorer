# Specification: Fix Hub Portal Spawn Offsets

## Overview
The user is experiencing positioning issues when entering hard-coded (mock database) portals from the Hub world. Upon entry, the player spawns outside the intended bounds of the new world, and the vertical (Y) alignment is also incorrect ("too close to the ground"). This suggests that the coordinate transformation logic applied to dynamic portals (fixing the `worldAnchorPosition` offset) needs to be correctly applied or verified for these mock database portals as well.

## Problem Analysis
-   **Current Behavior:** Entering a mock portal from the Hub places the player at an incorrect absolute position in the new world, effectively "outside bounds" and with a bad height offset.
-   **Likely Cause:** The `Portal` component's navigation logic (`handleNavigation`) might be calculating the new `worldAnchorPosition` based on the assumption that the player is currently at `(0,0,0)` or a specific offset, which might not be true for these pre-placed Hub portals. Alternatively, the "local position" of these mock portals might be defined incorrectly in the mock data relative to how the `Portal` component expects them.

## Functional Requirements
1.  **Correct Spawn Position:** When entering a mock portal from the Hub, the player MUST appear at the origin (or intended spawn point) of the target world.
2.  **Consistent Coordinate Logic:** The fix applied for dynamic portals (adding `worldAnchorPosition` to the portal's local position to find the new anchor) must be validated for Hub portals. If Hub portals have a `worldAnchorPosition` of `(0,0,0)` (since the Hub is the root), their "local" position is their absolute position.

## Refactoring Scope
-   **File:** `src/store/mockRegistryData.ts` - Verify the positions of the mock portals.
-   **File:** `src/components/Portal.tsx` - Debug/Verify `handleNavigation` logic specifically for the Hub -> World transition.
-   **File:** `src/store/worldSlice.ts` or `src/Scene.tsx` - Ensure the Hub itself is correctly anchored at `(0,0,0)` initially.

## Acceptance Criteria
-   [ ] Enter a mock portal in the Hub.
-   [ ] Verify the player spawns inside the new world boundaries.
-   [ ] Verify the player's height (Y-level) is correct relative to the new world's floor.
