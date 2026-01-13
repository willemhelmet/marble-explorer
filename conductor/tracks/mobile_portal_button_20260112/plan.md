# Plan: Mobile Portal Creation Button

This plan covers the integration of the mobile "Create Portal" virtual button into the existing `PortalSpawner` logic using `bvhecctrl`'s button store.

## Phase 1: Implementation

- [x] Task 1: Integrate Mobile Button Listener 9c17d74
  - Update `src/components/PortalSpawner.tsx` to use `useButtonStore` from `bvhecctrl`.
  - Implement `useRef` to track previous button state (`wasPressed`).
  - Add `useEffect` to trigger `openPortalUI()` when the button state transitions from `false` to `true`.
  - Ensure the logic respects the `playing` status.

- [x] Task 2: Verification & Cleanup 295deed
  - Perform a manual review of the logic for potential edge cases (e.g., rapid clicking).
  - Verify the button triggers the UI as expected on mobile/simulated touch devices.

- [ ] Task: Conductor - User Manual Verification 'Phase 1: Implementation' (Protocol in workflow.md)