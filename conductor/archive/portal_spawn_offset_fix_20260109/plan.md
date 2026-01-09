# Plan: Fix Portal Spawning Offset

## Phase 1: Diagnosis and Coordinate Space Alignment [checkpoint: auto]

_Identify the exact coordinate mismatch and implement a fix to ensure portals spawn at the player's local position relative to the world anchor._

- [x] Task: Create a reproduction unit test for `PortalSpawner` that verifies spawning in a world with a non-zero `worldAnchorPosition`. 63288
- [x] Task: Modify `src/components/PortalSpawner.tsx` to calculate the portal's position relative to the `worldAnchorPosition`.
- [x] Task: Verify that the portal spawns at the correct local coordinates so it appears at the player's world position.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Spawning Fix' (Protocol in workflow.md)

## Phase 2: Traversal Logic Verification [checkpoint: 456dc75]

_Ensure that the interaction/traversal logic still works correctly after the coordinate change._

- [x] Task: Create a unit test for `Portal.tsx` that simulates navigation from an offset world anchor and asserts the correct *absolute* new anchor position. 64781
- [x] Task: Modify `src/components/Portal.tsx` to add the current `worldAnchorPosition` to the portal's local position when setting the new world anchor. 64781
- [x] Task: Update unit tests for `Portal.tsx` to ensure `distanceTo` calculations are still accurate with the new positioning. b56c8e7
- [x] Task: Verify end-to-end that walking into a portal spawned in a dynamic world still triggers navigation.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Traversal Verification' (Protocol in workflow.md) 456dc75
- [ ] Task: Verify end-to-end that walking into a portal spawned in a dynamic world still triggers navigation.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Traversal Verification' (Protocol in workflow.md)
