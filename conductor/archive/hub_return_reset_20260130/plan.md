# Implementation Plan: Hub Portal Return Reset

## Phase 1: Research and Infrastructure
Verify how `bvhecctrl` handles manual teleportation and velocity resets.

- [x] Task: Investigate `bvhecctrl` API 95dd5fa
    - [x] Check if `characterStatus` or `BVHEcctrl` props allow for direct position/velocity overrides.
- [x] Task: Update Store for Teleportation 1afc2a4
    - [x] Add `teleportRequest` to `PlayerSlice`.
    - [x] Add `requestTeleport` action.
- [x] Task: Update `Player.tsx` 1afc2a4
    - [x] Add `ref` to `BVHEcctrl`.
    - [x] Listen for `teleportRequest` in a `useEffect`.
    - [x] Perform teleport (set position, reset velocity, reset rotation).
- [x] Task: Update `Portal.tsx` db0dbd4
    - [x] Call `requestTeleport` when navigating to `"hub"`.

## Phase 3: Verification [checkpoint: 3dfb12c]
Verify the reset logic works correctly across different worlds.

- [x] Task: Manual Verification 3dfb12c
    - [x] Create a portal pointing to "hub" in a dynamic world.
    - [x] Walk into the portal.
    - [x] Confirm position is `[0, 0.8, 5]`.
    - [x] Confirm rotation is forward-facing.
    - [x] Confirm velocity is zero.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Verification' (Protocol in workflow.md) 3dfb12c
