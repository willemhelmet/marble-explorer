# Implementation Plan - Revamped Loading Screen

This plan outlines the steps to replace the default loader with a sleek, minimalist, black-background loader featuring the Karrik font and the world's display name.

## Phase 1: State ## Phase 1: State & Data Preparation Data Preparation [checkpoint: fc4faef]
Prepare the application state to make the world's `display_name` available to the `Loader` component.

- [x] Task: Update `worldSlice.ts` to ensure `display_name` is persisted and accessible. (3998bde)
- [x] Task: Ensure the `apiService.ts` correctly extracts and stores the `display_name` when a world is fetched. (1a8d7d6)
- [x] Task: Conductor - User Manual Verification 'State - [ ] Task: Conductor - User Manual Verification 'State & Data Preparation' (Protocol in workflow.md) Data Preparation' (Protocol in workflow.md)

## Phase 2: Loader Stylization ## Phase 2: Loader Stylization & Integration Integration [checkpoint: 2996069]
Apply the new design to the `<Loader />` component in `App.tsx` using its customization props.

- [x] Task: Define CSS style constants for the minimalist layout (container, bar, data, inner).
- [x] Task: Update the `<Loader />` component in `src/App.tsx` with the new styles and `dataInterpolation`.
- [x] Task: Modify `dataInterpolation` or the component structure to include the `display_name` from the store.
- [x] Task: Verify font-family "Karrik" is correctly applied to all text elements in the loader.
- [x] Task: Conductor - User Manual Verification 'Loader Stylization - [ ] Task: Conductor - User Manual Verification 'Loader Stylization & Integration' (Protocol in workflow.md) Integration' (Protocol in workflow.md)

## Phase 3: Verification & Polishing
Final checks to ensure the transition is smooth and the UI meets the spec.

- [ ] Task: Test the loading sequence with a real or simulated slow API response to verify the centered layout.
- [ ] Task: Verify the smooth 300ms transition from the black screen to the 3D scene.
- [ ] Task: Conductor - User Manual Verification 'Verification & Polishing' (Protocol in workflow.md)
