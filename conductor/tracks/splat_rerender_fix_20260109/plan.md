# Plan: Prevent Unnecessary Splat Re-renders

## Phase 1: Diagnosis & Reproduction [checkpoint: manual]

_Identify the exact cause of the re-renders by profiling component updates._

- [x] Task: Add `console.log` lifecycles (mount/unmount) to `SparkRenderer`, `World`, and `Scene` to confirm which components are unmounting.
- [x] Task: Create a reproduction test case (manual) to verify the "White Flash" on Pause toggle.
- [x] Task: Analyze `Scene.tsx` and `useMyStore` subscriptions to identify broad state dependencies.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Diagnosis' (Protocol in workflow.md)

## Phase 2: Component Architecture Refactor [checkpoint: 0c4e32a]

_Isolate heavy components from volatile state._

- [x] Task: Create a dedicated `WorldContent` component that wraps the static/heavy world elements (`SparkRenderer`, `WorldCollider`, `WorldContainer`). 0c4e32a
- [x] Task: Refactor `WorldContent` to use `React.memo` and strictly defined props (avoiding direct store subscriptions where possible, or selecting only stable data). 0c4e32a
- [x] Task: Ensure `Scene.tsx` only handles high-level layout and passes stable props to `WorldContent`. 0c4e32a
- [x] Task: Optimize `useMyStore` selectors in `Scene.tsx` and child components to pick atomic values (e.g., `useMyStore(s => s.status)` instead of `useMyStore()`). 0c4e32a
- [x] Task: Conductor - User Manual Verification 'Phase 2: Refactor' (Protocol in workflow.md) 0c4e32a

## Phase 3: Verification
*Confirm the fix and ensure no regressions.*

- [ ] Task: Verify that toggling 'Escape' (Pause) no longer triggers a re-mount of `SparkRenderer` (no console logs from mount).
- [ ] Task: Verify that walking through a portal still correctly triggers an unmount/remount for the *new* world assets.
- [ ] Task: Verify Leva controls still work without re-rendering the whole world.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Verification' (Protocol in workflow.md)
