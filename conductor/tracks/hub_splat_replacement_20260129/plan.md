# Plan: Local Hub Splat Replacement

## Phase 1: Foundation & Asset Setup [checkpoint: 46a24df]
- [x] Task: Verify and organize local splat asset
    - [x] Ensure `public/marble-explorer-lobby.spz` exists and is valid.
- [x] Task: Define Hub state and types
    - [x] Update `gameSlice.ts` or `worldSlice.ts` to include a explicit "hub" state if not already present.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Asset Setup' (Protocol in workflow.md)

## Phase 2: Component Development
- [x] Task: Create Hub component structure
    - [x] Write tests for `<Hub />` component in `src/components/Hub.test.tsx`.
    - [x] Implement `src/components/Hub.tsx` using `@sparkjsdev/spark` to render the lobby splat.
- [x] Task: Integrate Hub into Scene
    - [x] Write tests in `src/Scene.test.tsx` to verify Hub rendering based on state.
    - [x] Update `src/Scene.tsx` to conditionally render `<Hub />` instead of the placeholder grid.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Component Development' (Protocol in workflow.md)

## Phase 3: Logic & Transitions
- [ ] Task: Handle Hub transitions
    - [ ] Write tests for world transition logic (returning to hub).
    - [ ] Ensure `socketManager.ts` or relevant service correctly triggers the Hub state when "returning home".
- [ ] Task: Verify Portal Spawning in Hub
    - [ ] Manually verify that `<PortalSpawner />` works correctly with the new Hub background.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Logic & Transitions' (Protocol in workflow.md)

## Phase 4: Cleanup & Polish
- [ ] Task: Remove obsolete grid/placeholder code
    - [ ] Delete `src/components/Grid.tsx` (if it exists) or remove references to the placeholder floor.
- [ ] Task: Final Quality Gate Check
    - [ ] Run all tests, linting, and verify mobile responsiveness.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Cleanup & Polish' (Protocol in workflow.md)