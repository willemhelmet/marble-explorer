# Implementation Plan: Quaternion Orientation Sync & Hub Reset Fix

## Phase 1: Research and Infrastructure [checkpoint: 9acb3cc]
Verify the current synchronization flow and prepare the transition to Quaternions.

- [x] Task: Audit current rotation sync
    - [x] Identify where `Euler` is converted to data for `socketManager.sendMovement`.
    - [x] Identify how `RemotePlayer.tsx` receives and applies these angles.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Research and Infrastructure' (Protocol in workflow.md)

## Phase 2: Implementation - Quaternion Migration [checkpoint: 77484f3]
Switch the orientation synchronization from Euler angles to Quaternions.

- [x] Task: Update `socketManager.ts` 1afc2a4
    - [x] Modify `sendMovement` to accept a `Quaternion`.
- [x] Task: Update `Player.tsx` b9b5814
    - [x] Update the throttled movement sync to send `camera.quaternion` instead of `camera.rotation`.
- [x] Task: Update `RemotePlayer.tsx` db0dbd4
    - [x] Update the `RemotePlayer` component to receive and apply `quaternion` data to the model.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Implementation - Quaternion Migration' (Protocol in workflow.md)

## Phase 3: Hub Reset Refinement
Fix the orientation offset bug during hub return.

- [x] Task: Refine `Portal.tsx` and `Player.tsx` teleport logic db0dbd4
    - [x] Ensure the teleport request uses a clean "forward" quaternion (identity or [0, 0, 0, 1]).
    - [x] Verify that the immediate `sendMovement` call after teleport propagates the correct orientation.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Hub Reset Refinement' (Protocol in workflow.md)

## Phase 4: Verification and Cleanup
Ensure no regressions and stable synchronization.

- [ ] Task: Multi-client testing
    - [ ] Open two browser windows.
    - [ ] Test looking up/down (gimbal lock check).
    - [ ] Test returning to hub and verify avatar orientation in the second window.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Verification and Cleanup' (Protocol in workflow.md)
