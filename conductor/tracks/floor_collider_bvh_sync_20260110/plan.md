# Plan: Fix Floor Collider BVH Sync on Portal Entry

## Phase 1: Diagnosis & Reproduction [checkpoint: auto]

_Confirm the "ghost floor" behavior where the visual floor moves but physics remains behind._

- [x] Task: Add a temporary debug helper (e.g., a visible red wireframe mesh) that tracks the physics collider's actual position as reported by `bvhecctrl`. 4b75e56
- [ ] Task: Perform a "Distance Test": Enter a portal, move 100m away, and verify if the player falls at a specific threshold.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Diagnosis' (Protocol in workflow.md)

## Phase 2: Force Collider Remounting [checkpoint: auto]

_Implement the key-based remounting strategy to ensure the physics engine sees the new coordinates._

- [ ] Task: Update `src/components/FloorCollider.tsx` to include a `key` prop on the `StaticCollider` or `Bvh` component derived from `worldAnchorPosition`.
- [ ] Task: Refactor `FloorCollider` to ensure it only renders the mesh when a valid anchor is present.
- [ ] Task: Verify that the physics debug helper now follows the visual floor correctly after portal traversal.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Remounting Fix' (Protocol in workflow.md)

## Phase 3: Cleanup & Regression Testing [checkpoint: auto]

_Ensure stability across multiple jumps and remove debug artifacts._

- [ ] Task: Perform "Sequential Jump Test": Traverse through 3 different worlds and confirm floor stability in each.
- [ ] Task: Remove all debug wireframes and logs added in Phase 1.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Verification' (Protocol in workflow.md)
