# Plan: Fix Portal Render Loop

## Phase 1: Refactor Portal Subscriptions [checkpoint: auto]

_Switch to atomic selectors to break the update loop._

- [x] Task: Refactor `src/components/Portal.tsx` to use atomic `useMyStore` selectors for all actions and state.
- [x] Task: Verify other components (`Player`, `Crosshair`) for similar non-atomic usage and fix if necessary.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Fix' (Protocol in workflow.md)
