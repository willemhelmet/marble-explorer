# Plan: Fix World Centering on Portal Entry

## Phase 1: Coordinate Tracing & Diagnosis [checkpoint: auto]

_Identify the exact point where the coordinate drift occurs._

- [x] Task: Add verbose logging to `handleNavigation` in `src/components/Portal.tsx` to output `characterStatus.position`, `worldAnchorPosition`, and the resulting `newAnchor`. a18e762
- [x] Task: Add logging to `src/WorldContent.tsx` to output the `worldAnchorPos` prop received by the component. a18e762
- [x] Task: Perform a manual test run by moving 10m away from the origin and entering a portal, then capture the logs. 74348
- [x] Task: Conductor - User Manual Verification 'Phase 1: Diagnosis' (Protocol in workflow.md)

## Phase 2: Logic Fix & Normalization [checkpoint: 4c50b13]

_Correct the anchoring logic based on the diagnosis._

- [x] Task: Update the anchoring logic in `Portal.tsx` to ensure absolute world-space centering. (Handled by prior refactor) 76321
- [x] Task: Verify that the `worldAnchorPosition` is correctly reset when returning to the Hub. 76321
- [x] Task: Create a unit test for `Portal.tsx` that simulates navigation from various non-zero coordinates and asserts exact centering. 76321
- [x] Task: Conductor - User Manual Verification 'Phase 2: Fix Verification' (Protocol in workflow.md) 4c50b13

## Phase 3: Deep Debugging & Scaling Analysis [checkpoint: auto]

_Investigate persistent offset issues, focusing on scaling factors and camera/physics sync._

- [x] Task: Add on-screen debug text (using `@react-three/drei`'s `Text` or `Html`) to display real-time `characterStatus.position`, `camera.position`, and `worldAnchorPosition` directly in the view.
- [x] Task: Verify if the `WorldContent` scale of `[2, 2, 2]` is affecting the perceived center. Create a test by temporarily setting scale to `[1, 1, 1]` and observing if centering improves.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Deep Debugging' (Protocol in workflow.md)