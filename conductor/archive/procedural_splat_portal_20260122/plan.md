# Implementation Plan - Procedural Splat Portal

## Phase 1: Component Refactor
- [x] Task: Remove Legacy UI Elements 11e4d62
    - [ ] Remove `Billboard` and `Text` from `@react-three/drei` imports in `src/components/Portal.tsx`.
    - [ ] Remove the `<Billboard>` block containing `<Text>` from the `Portal` component's return statement.
- [x] Task: Add Spark.js Dependencies 24ef2ba
    - [x] Import `SplatMesh`, `constructSpherePoints`, and `dyno` from `@sparkjsdev/spark` in `src/components/Portal.tsx`.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Component Refactor' (Protocol in workflow.md) 24ef2ba

## Phase 2: Procedural Splat Integration
- [x] Task: Initialize SplatMesh with constructSpherePoints 236b2af
    - [x] Create a `useMemo` hook to initialize the `SplatMesh`.
    - [x] Inside `constructSplats`, use `constructSpherePoints` with `maxDepth: 4` and appropriate `pointRadius`.
- [x] Task: Implement Color Dyno Logic 236b2af
    - [x] Define a `dyno.dynoColor` uniform (e.g., `statusColor`) using `useMemo`.
    - [x] Implement the `objectModifier` in the `SplatMesh` to apply this color to the splats on the GPU.
- [x] Task: Sync Status with Dyno 236b2af
    - [x] Add a `useEffect` hook to update the `statusColor.value` whenever `portal.status` or `isHovered` changes, using the existing `getStatusColor` logic.
- [x] Task: Update Scene Graph 236b2af
    - [x] Set `visible={false}` on the existing `<Sphere />` component (to keep it as a raycast target).
    - [x] Add `<primitive object={splatMesh} />` inside the `<group>` in the `Portal` return.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Procedural Splat Integration' (Protocol in workflow.md) 236b2af

## Phase 3: Dyno Refactor
- [x] Task: Refactor PortalDyno to direct Dyno object 158854d
    - [x] Update `src/dynos/portalDyno.ts` to export `PortalDyno` as a `new dyno.Dyno`.
    - [x] Update `src/components/Portal.tsx` to use `PortalDyno.apply` within `dynoBlock`.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Dyno Refactor' (Protocol in workflow.md) 158854d

## Phase 4: Dyno Type Correction
- [x] Task: Switch to dynoVec3 and RGB Arrays 885c640
    - [x] Update `getStatusColor` in `src/components/Portal.tsx` to return `[r, g, b]`.
    - [x] Update `statusColor` initialization to use `dyno.dynoVec3`.
    - [x] Update color sync logic.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Dyno Type Correction' (Protocol in workflow.md) 885c640

## Phase 5: Final Polish & Cleanup
- [x] Task: Remove Point Light 236b2af
    - [x] Remove the `<pointLight>` component from the `Portal` return statement.
- [x] Task: Verify Interaction & Visuals 236b2af
    - [x] Ensure clicking the splat area still opens the UI.
    - [x] Ensure hover states still trigger the crosshair.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Final Polish & Cleanup' (Protocol in workflow.md) 236b2af
