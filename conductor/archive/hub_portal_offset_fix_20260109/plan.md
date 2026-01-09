# Plan: Fix Hub Portal Spawn Offsets

## Phase 1: Diagnosis and Data Verification [checkpoint: auto]

_Verify the coordinate data in the mock registry and debug the Hub-to-World transition logic._

- [x] Task: Audit `src/store/mockRegistryData.ts` to ensure portal positions match their visual/intended locations. 69977
- [x] Task: Create a unit test for `Portal.tsx` specifically simulating a transition from the Hub (anchor at 0,0,0) to a target world via a mock portal. 69977
- [x] Task: Investigate the "wonky y offset" by logging the player's world position exactly at the moment of traversal. 69977
- [x] Task: Conductor - User Manual Verification 'Phase 1: Diagnosis' (Protocol in workflow.md)

## Phase 2: Logic and Data Refinement [checkpoint: auto]

_Apply fixes to ensure seamless transitions and correct world centering._

- [x] Task: If data is incorrect, update `src/store/mockRegistryData.ts` positions. (Handled by logic fix) 70413
- [x] Task: Refine `handleNavigation` in `src/components/Portal.tsx` to ensure the new world anchor is perfectly aligned with the player's position at the time of entry. 70413
- [x] Task: Verify that the height offset (Y-axis) is correctly maintained or reset during the transition. 70413
- [x] Task: Conductor - User Manual Verification 'Phase 2: Transition Fix' (Protocol in workflow.md)
