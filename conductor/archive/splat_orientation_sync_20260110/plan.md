# Plan: Synchronize Splat Orientation on Portal Entry

## [x] Phase 1: Diagnosis & Logic Correction [checkpoint: auto]

_Verify the current "wonky" behavior and implement the correct quaternion-to-euler mapping._

- [x] Task: Add temporary verbose logging in `src/components/Portal.tsx` to output `characterStatus.quaternion` and the current `worldAnchorOrientation` during traversal.
- [x] Task: Refactor the orientation calculation in `Portal.tsx` to correctly extract the Y-yaw from the player's quaternion and apply it to the `worldAnchorOrientation`.
- [x] Task: Ensure the `setWorldAnchorOrientation` action in `src/store/portalSlice.ts` correctly handles `THREE.Euler` objects and updates the state.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Diagnosis & Fix' (Protocol in workflow.md)

## [x] Phase 2: Logic Fix (Spawn Position) [checkpoint: auto]

_Fix the regression where portals spawn in the wrong location due to world rotation._

- [x] Task: Update `src/components/PortalSpawner.tsx` to apply the inverse of `worldAnchorOrientation` when calculating the local spawn position of new portals.

## [x] Phase 3: Verification & Cleanup [checkpoint: auto]

_Perform manual testing and remove debug artifacts._

- [x] Task: Perform "Cardinal Entry Test": Enter portals from North, South, East, and West directions and verify the splat always faces the player.
- [x] Task: Verify that looking up or down (X-axis rotation) while entering a portal does NOT result in a tilted floor.
- [x] Task: Verify that spawning a new portal ('P') works correctly in a rotated world.
- [x] Task: Remove all temporary logging and debug helpers.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Final Verification' (Protocol in workflow.md)
