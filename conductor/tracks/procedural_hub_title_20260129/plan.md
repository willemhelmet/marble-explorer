# Plan: Procedural Hub Title Splat

## Phase 1: Logic & Utility Setup [checkpoint: 6c1740a]
- [x] Task: Research `textSplats` usage
    - [x] Verify `textSplats` export in `@sparkjsdev/spark`.
- [x] Task: Create Title component structure
    - [x] Write tests for `<HubTitle />` component in `src/components/marble/HubTitle.test.tsx`.
    - [x] Implement `src/components/marble/HubTitle.tsx` using `textSplats`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Logic & Utility Setup' (Protocol in workflow.md)

## Phase 2: Integration & Styling [checkpoint: c2647dc]
- [x] Task: Integrate HubTitle into Hub
    - [x] Add `<HubTitle />` to `src/components/marble/Hub.tsx` or `src/components/marble/WorldContent.tsx` (hub state).
- [x] Task: Fine-tune Position and Scale
    - [x] Adjust `y` position and `scale` for optimal readability and aesthetic.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Integration & Styling' (Protocol in workflow.md)

## Phase 3: Cleanup & Final Check
- [ ] Task: Verify Hub Title visibility and alignment
    - [ ] Ensure the title is correctly aligned and visible across different window sizes.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Cleanup & Final Check' (Protocol in workflow.md)