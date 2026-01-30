# Implementation Plan: Hub Portal Return Reset

## Phase 1: Research and Infrastructure
Verify how `bvhecctrl` handles manual teleportation and velocity resets.

- [x] Task: Investigate `bvhecctrl` API 95dd5fa
    - [x] Check if `characterStatus` or `BVHEcctrl` props allow for direct position/velocity overrides.
- [ ] Task: Update Store for Teleportation
    - [ ] Add `teleportRequest` to `PlayerSlice`.
    - [ ] Add `requestTeleport` action.
- [ ] Task: Update `Player.tsx`
    - [ ] Add `ref` to `BVHEcctrl`.
    - [ ] Listen for `teleportRequest` in a `useEffect`.
    - [ ] Perform teleport (set position, reset velocity, reset rotation).
- [ ] Task: Update `Portal.tsx`
    - [ ] Call `requestTeleport` when navigating to `"hub"`.

## Phase 3: Verification
Verify the reset logic works correctly across different worlds.

- [ ] Task: Manual Verification
    - [ ] Create a portal pointing to "hub" in a dynamic world.
    - [ ] Walk into the portal.
    - [ ] Confirm position is `[0, 0.8, 5]`.
    - [ ] Confirm rotation is forward-facing.
    - [ ] Confirm velocity is zero.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Verification' (Protocol in workflow.md)
