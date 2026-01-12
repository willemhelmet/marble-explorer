# Implementation Plan - Remove Local Empty Portal

## Phase 1: Store & Spawner Refactor
- [~] Task: Remove `editingPortal` and `setEditingPortal` from `worldSlice.ts` (if no longer needed).
    - [ ] Sub-task: Remove `addPortal` and `setEditingPortal` calls.
- [ ] Task: Update `PortalSpawner.tsx`
    - [ ] Sub-task: Remove `addPortal` and `setEditingPortal` calls.
    - [ ] Sub-task: Simply trigger `openPortalUI()`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Store & Spawner Refactor' (Protocol in workflow.md)

## Phase 2: UI Logic Update
- [ ] Task: Update `PortalUI.tsx`
    - [ ] Sub-task: Remove logic that looks up `editingPortal` in the registry.
    - [ ] Sub-task: Move spawn position calculation logic (currently in `PortalSpawner.tsx`) into `PortalUI.tsx` (inside `handleSubmit`).
    - [ ] Sub-task: Update `handleSubmit` to use fresh position/rotation calculated at that moment.
    - [ ] Sub-task: Remove `removePortal` call from `handleSubmit` and `handleCancel`.
- [ ] Task: Cleanup unused state/actions.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: UI Logic Update' (Protocol in workflow.md)
