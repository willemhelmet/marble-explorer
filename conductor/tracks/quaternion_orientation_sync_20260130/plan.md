# Implementation Plan: Quaternion Orientation Sync & Hub Reset Fix

## Phase 1: Research and Infrastructure
Verify the current synchronization flow and prepare the transition to Quaternions.

- [x] Task: Audit current rotation sync
    - [x] Identify where `Euler` is converted to data for `socketManager.sendMovement`.
    - [x] Identify how `RemotePlayer.tsx` receives and applies these angles.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Research and Infrastructure' (Protocol in workflow.md)

## Phase 2: Implementation - Quaternion Migration
Switch the orientation synchronization from Euler angles to Quaternions.

- [ ] Task: Update `socketManager.ts`
    - [ ] Modify `sendMovement` to accept a `Quaternion`.
- [ ] Task: Update `Player.tsx`
    - [ ] Update the throttled movement sync to send `camera.quaternion` instead of `camera.rotation`.
- [ ] Task: Update `RemotePlayer.tsx`
    - [ ] Update the `RemotePlayer` component to receive and apply `quaternion` data to the model.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Implementation - Quaternion Migration' (Protocol in workflow.md)

## Phase 3: Hub Reset Refinement
Fix the orientation offset bug during hub return.

- [ ] Task: Refine `Portal.tsx` and `Player.tsx` teleport logic
    - [ ] Ensure the teleport request uses a clean "forward" quaternion (identity or [0, 0, 0, 1]).
    - [ ] Verify that the immediate `sendMovement` call after teleport propagates the correct orientation.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Hub Reset Refinement' (Protocol in workflow.md)

## Phase 4: Verification and Cleanup
Ensure no regressions and stable synchronization.

- [ ] Task: Multi-client testing
    - [ ] Open two browser windows.
    - [ ] Test looking up/down (gimbal lock check).
    - [ ] Test returning to hub and verify avatar orientation in the second window.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Verification and Cleanup' (Protocol in workflow.md)
