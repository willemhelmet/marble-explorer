# Plan: Multi-Portal System & World Registry

## Phase 1: Data Architecture & World Slice [checkpoint: 3c85c03]

_Establish the World Registry with dummy data for testing._

- [x] Task: Create `store/worldSlice.ts` to manage `worldRegistry` and `currentWorldId`. d84b188
- [x] Task: Define types: `Portal` (id, position, url, status) and `Registry`. d84b188
- [x] Task: Create a `mockRegistryData.ts` file with seed data (Hub world, World
      A, World B) and import it as the initial state. d84b188
- [x] Task: Implement actions: `addPortal(worldId, portal)`,
      `updatePortal(worldId, portalId, data)`, and `switchWorld(worldId)`. d84b188
- [x] Task: Conductor - User Manual Verification 'Phase 1: Data Architecture'
      (Protocol in workflow.md) 3c85c03

## Phase 2: Dynamic Portal Components

_Refactor Scene to render portals from the Registry._

- [ ] Task: Update `src/Scene.tsx` to subscribe to `worldSlice`.
- [ ] Task: Refactor `src/components/Portal.tsx` to accept props for its
      specific data and render as "Wireframe" if URL is missing.
- [ ] Task: Map over `currentWorld.portals` in `Scene.tsx` to render
      `<Portal />` instances.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Dynamic Portal
      Components' (Protocol in workflow.md)

## Phase 3: Portal Creation Workflow

_Implement the "Spawn Empty -> Edit" workflow._

- [ ] Task: Implement 'P' key listener: Spawns a new `Portal` entry in the
      current world with `url: null` (Empty/Wireframe) at player position.
- [ ] Task: Update `Portal.tsx` click handler: If portal is empty (or clicked)
      open `PortalUI` focused on _this_ portal instance.
- [ ] Task: Update `PortalUI.tsx` to save the URL to the specific portal ID in
      the store upon confirmation.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Portal Creation
      Workflow' (Protocol in workflow.md)

## Phase 4: World Transition (Scene Swap)

_Implement the navigation logic between Registry entries._

- [ ] Task: Update collision/entry logic in `Portal.tsx` to trigger `switchWorld`
      (only if Portal has a valid URL).
- [ ] Task: Ensure `switchWorld` updates the global `assets` (or triggers a
      fetch) for the new world.
- [ ] Task: Verify navigation with the dummy data (Hub -> World A -> World B).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: World Transition'
      (Protocol in workflow.md)

## Phase 5: Cleanup & Polish

_Remove legacy single-portal code._

- [ ] Task: Remove obsolete single-portal state from `portalSlice.ts`.
- [ ] Task: Verify no regressions in Lobby rendering.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Cleanup & Polish'
      (Protocol in workflow.md)
