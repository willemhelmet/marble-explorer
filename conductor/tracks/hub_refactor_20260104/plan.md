# Plan: Refactor Hub to World System

## Phase 1: Scene Graph Restructuring [checkpoint: 78f11b7]

_Implement the `WorldContainer` pattern and fix coordinate issues._

- [x] Task: Create a new `WorldContainer` component (or inline group) in `Scene.tsx` that wraps Geometry, Colliders, and Portals. 78f11b7
- [x] Task: Move `currentWorld.portals` rendering *inside* this container. 78f11b7
- [x] Task: Move `Grid`, `FloorCollider`, `SparkRenderer`, and `WorldCollider` *inside* this container. 78f11b7
- [x] Task: Conductor - User Manual Verification 'Phase 1: Scene Graph' (Protocol in workflow.md) 78f11b7

## Phase 2: Logic Unification [checkpoint: 78f11b7]

_Replace legacy boolean logic with ID-based logic._

- [x] Task: Refactor `Scene.tsx` to use `currentWorldId === 'hub'` for conditional rendering instead of `isPlayerInside`. 78f11b7
- [x] Task: Update `Portal.tsx` to remove `isPlayerInside` updates (or keep them sync if needed for other components). 78f11b7
- [x] Task: Deprecate/Remove `isPlayerInside` from `PortalSlice` if no longer used. 78f11b7
- [x] Task: Conductor - User Manual Verification 'Phase 2: Logic Unification' (Protocol in workflow.md) 78f11b7

## Phase 3: Verification & Cleanup [checkpoint: 78f11b7]

_Ensure regressions are squashed._

- [x] Task: Verify "Hub -> World -> Hub" loop works with correct portal positioning. 78f11b7
- [x] Task: Verify 'P' key spawning works correctly in both Hub and World (spawned portal should attach to current world). 78f11b7
- [x] Task: Conductor - User Manual Verification 'Phase 3: Verification' (Protocol in workflow.md) 78f11b7
