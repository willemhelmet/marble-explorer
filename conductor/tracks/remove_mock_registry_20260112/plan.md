# Plan: Remove Mock Registry Data

This plan outlines the steps to remove hardcoded mock registry data and transition the application to purely server-driven world data.

## Phase 1: Store Cleanup & Initialization [checkpoint: a920a48]

- [x] Task 1: Update `worldSlice.ts` Initialization dfe70d8
  - Remove the import of `mockRegistry` from `./mockRegistryData`.
  - Update the `createWorldSlice` initial state to set `worldRegistry` to `{}`.
  - Remove any other references to `mockRegistry` in this file.

- [x] Task 2: Remove `mockRegistryData.ts` File 3b13661
  - Delete `src/store/mockRegistryData.ts`.

- [x] Task 3: Verify Compilation 683826f
  - Run the build/type-check command to ensure no lingering imports or references remain.

- [x] Task: Conductor - User Manual Verification 'Phase 1: Store Cleanup & Initialization' (Protocol in workflow.md) 22ad7a5

## Phase 2: Runtime Verification

- [x] Task 4: Confirm Socket Data Population 1f843ef
  - Manually verify that `socketManager` still correctly populates the `worldRegistry` via the `portals` and `portal_added` socket events.
  - Since the client now starts with an empty registry, ensure that joining a room (like "hub") results in the correct portal state being reflected in the UI.

- [ ] Task: Conductor - User Manual Verification 'Phase 2: Runtime Verification' (Protocol in workflow.md)
