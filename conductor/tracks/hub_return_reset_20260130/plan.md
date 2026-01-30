# Implementation Plan: Hub Portal Return Reset

## Phase 1: Research and Infrastructure
Verify how `bvhecctrl` handles manual teleportation and velocity resets.

- [ ] Task: Investigate `bvhecctrl` API
    - [ ] Check if `characterStatus` or `BVHEcctrl` props allow for direct position/velocity overrides.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Research and Infrastructure' (Protocol in workflow.md)

## Phase 2: Implementation
Update the portal navigation logic to include player and physics resets.

- [ ] Task: Update `Portal.tsx`
    - [ ] Modify `handleNavigation` to teleport the player when `portal.url === "hub"`.
    - [ ] Implement rotation reset.
    - [ ] Implement velocity/physics reset using `bvhecctrl` methods.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Implementation' (Protocol in workflow.md)

## Phase 3: Verification
Verify the reset logic works correctly across different worlds.

- [ ] Task: Manual Verification
    - [ ] Create a portal pointing to "hub" in a dynamic world.
    - [ ] Walk into the portal.
    - [ ] Confirm position is `[0, 0.8, 5]`.
    - [ ] Confirm rotation is forward-facing.
    - [ ] Confirm velocity is zero.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Verification' (Protocol in workflow.md)
