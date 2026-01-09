# Specification: Fix Portal Spawning Offset in Dynamic Worlds

## Overview
When a user spawns a portal in a dynamic (non-Hub) world, the portal appears at an incorrect location (specifically, near the world's origin) instead of in front of the character. This suggests that the portal's spawn position is not correctly accounting for the `worldAnchorPosition` offset that shifts the entire world container.

## Problem Analysis
-   **Current Behavior:** In the Hub, portals spawn correctly. In a dynamic world, they spawn offset from the character, seemingly ignoring the character's relative position within the shifted world container.
-   **Root Cause Hypothesis:** The `PortalSpawner` or `Scene` logic likely calculates the portal's position in *world space* (absolute), but the portal is rendered inside a `group` that is offset by `worldAnchorPosition`. This results in a "double transform" or a missing inverse transform when placing the portal into the scene graph.

## Functional Requirements
1.  **Correct Spawning:** When creating a portal in *any* world (Hub or Dynamic), the portal MUST spawn directly in front of the player's current position.
2.  **Coordinate Space Handling:** The system MUST correctly convert the player's absolute world position into the local coordinate space of the parent container (if portals are parented to the offset world group) OR ensure portals are parented in a way that aligns with the player's coordinate system.

## Refactoring Scope
-   **File:** `src/components/PortalSpawner.tsx` (or wherever portal creation logic resides) - Adjust position calculation to account for `worldAnchorPosition`.
-   **File:** `src/store/worldSlice.ts` - Verify if portal positions are stored in global or local coordinates.

## Acceptance Criteria
-   [ ] Create a portal in the Hub -> Appears in front of player.
-   [ ] Enter a dynamic world -> Move away from origin -> Create a portal.
-   [ ] The new portal in the dynamic world MUST appear in front of the player, not at the world's origin.
