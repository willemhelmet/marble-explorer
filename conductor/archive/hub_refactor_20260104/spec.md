# Specification: Refactor Hub to World System

## Overview
This track aims to eliminate the legacy "Single Portal" assumptions by unifying the scene architecture. The "Hub" will no longer be a special case managed by boolean flags (`isPlayerInside`) but will be treated as a standard "World" configuration. All world-specific entities (Geometry, Colliders, Portals) will be parented to a single `WorldContainer` that respects the `worldAnchorPosition`.

## Core Problems Solved
1.  **Coordinate Mismatch:** Portals in downloaded worlds currently render at global coordinates instead of relative to the world's anchor.
2.  **Binary State Logic:** The `isPlayerInside` boolean creates unnecessary branching and edge cases (e.g., hiding portals).
3.  **Hardcoded Hub:** The Hub logic is separated from the dynamic world logic, making it harder to extend.

## Architectural Changes

### 1. The World Container
A new logical grouping in `Scene.tsx` that wraps all content for the `currentWorld`.
```tsx
<group position={worldAnchorPosition}>
   {/* All World Content Goes Here */}
</group>
```

### 2. Unified Rendering Logic
Instead of `if (!isPlayerInside)`, we use `currentWorldId`.
- **Geometry:**
    - If `id === "hub"` -> Render `<Grid />` & `<AxesHelper />`.
    - If `id !== "hub"` -> Render `<SparkRenderer />` (using global `assets`).
- **Physics:**
    - If `id === "hub"` -> Render `<FloorCollider />`.
    - If `id !== "hub"` -> Render `<WorldCollider />`.
- **Portals:**
    - Always render `currentWorld.portals`.

### 3. State Deprecation
- `isPlayerInside`: Mark as deprecated in `PortalSlice` or remove entirely if safe.
- **Migration:** Replace usages of `isPlayerInside` with `currentWorldId !== "hub"` or `assets !== null`.

## Functional Requirements
1.  **Hub Parity:** The Hub must look and behave exactly as before (Grid, Floor, starting portals).
2.  **Relative Positioning:** When entering "World A" (anchored at `3,1,-5`), its portals (e.g., exit portal) must appear at the correct relative position.
3.  **Seamless Transition:** Switching from Hub to World and back must handle the "Asset Swap" cleanly (unloading Grid, loading Splat).

## Acceptance Criteria
- [ ] `Scene.tsx` has no `!isPlayerInside` checks for rendering high-level components.
- [ ] Portals in "World A" appear in the correct location relative to the splat.
- [ ] The Player can navigate Hub -> World A -> Hub without visual glitches.
- [ ] Codebase is cleaner with reduced branching logic.
