# Plan: Fix Portal Transition Logic

## Phase 1: Refactor PortalUI to Defer Asset Loading [checkpoint: 20b08c5]

_Decouple the UI from the global world state by removing immediate asset loading._

- [x] Task: Create unit tests for `PortalUI` to verify it updates the store correctly without calling `setAssets`. cc58f78
- [x] Task: Modify `src/components/ui/PortalUI.tsx` to remove the `setAssets` call and rely on `updatePortal`. cc58f78
- [x] Task: Verify that submitting the form only updates the portal status to "ready" and stores the URL. cc58f78
- [x] Task: Conductor - User Manual Verification 'Phase 1: UI Refactor' (Protocol in workflow.md) 20b08c5

## Phase 2: Refactor Portal Component for Robust Navigation [checkpoint: auto]

_Consolidate world-switching logic within the Portal component's traversal handler._

- [ ] Task: Create unit tests for `Portal.tsx` to verify `handleNavigation` correctly fetches assets and updates world state.
- [ ] Task: Refactor `src/components/Portal.tsx` to include asset fetching within `handleNavigation`.
- [ ] Task: Update `handleNavigation` to manage `setAssets`, `switchWorld`, and `setWorldAnchorPosition` atomically.
- [ ] Task: Add error handling to `handleNavigation` to revert portal status or show an error state if the fetch fails.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Navigation Refactor' (Protocol in workflow.md)

## Phase 3: Integration & Final Verification [checkpoint: auto]

_Ensure end-to-end functionality and resolve legacy code issues._

- [ ] Task: Verify "Hub" navigation (returning to the start) still works correctly and resets assets.
- [ ] Task: Clean up any remaining legacy navigation code identified in `Portal.tsx`.
- [ ] Task: Perform a full end-to-end test of creating a portal in a dynamic world and traversing it.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Verification' (Protocol in workflow.md)
