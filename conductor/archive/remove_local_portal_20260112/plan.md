# Implementation Plan - Remove Local Empty Portal

## Phase 1: Store & Spawner Refactor [checkpoint: 7e97e29]
- [x] Task: Remove `editingPortal` and `setEditingPortal` from `worldSlice.ts` (if no longer needed).
    - [x] Sub-task: Remove `addPortal` and `setEditingPortal` calls.
    - [x] Sub-task: Simply trigger `openPortalUI()`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Store & Spawner Refactor' (Protocol in workflow.md)

## Phase 2: UI Logic Update [checkpoint: 7e97e29]
- [x] Task: Update `PortalUI.tsx`
    - [x] Sub-task: Remove logic that looks up `editingPortal` in the registry.
    - [x] Sub-task: Move spawn position calculation logic (currently in `PortalSpawner.tsx`) into `PortalUI.tsx` (inside `handleSubmit`).
    - [x] Sub-task: Update `handleSubmit` to use fresh position/rotation calculated at that moment.
    - [x] Sub-task: Remove `removePortal` call from `handleSubmit` and `handleCancel`.
- [x] Task: Cleanup unused state/actions.
- [x] Task: Conductor - User Manual Verification 'Phase 2: UI Logic Update' (Protocol in workflow.md)
