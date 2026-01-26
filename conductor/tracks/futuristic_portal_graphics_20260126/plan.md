# Implementation Plan - Futuristic Noise-Driven Portal Graphics

## Phase 1: Technical Foundation & Base Animation [checkpoint: 66872cf]
- [x] Task: Create `NoiseDyno` Utility [TDD] [e66250d]
    - [x] Write tests for a new `PortalNoiseDyno.ts` that verify it correctly wraps the `dyno.Dyno` logic.
    - [x] Implement the `Dyno` object with GLSL `globals` including a 3D noise function (e.g., Simplex Noise).
    - [x] Add `rhythmicPulse` logic (sin/cos based scaling) to the shader.
- [x] Task: Integrate `NoiseDyno` into `Portal.tsx` [885c640]
    - [x] Replace or extend the current `PortalDyno` usage with the new `NoiseDyno`.
    - [x] Implement the `onFrame` handler to update a `uTime` float dyno and call `mesh.updateVersion()`.
- [x] Task: Conductor - User Manual Verification 'Technical Foundation' (Protocol in workflow.md)

## Phase 2: Visual Refinement (Displacement & Veins)
- [ ] Task: Implement Surface Ripples (Displacement)
    - [ ] Update the GLSL `statements` to displace `gsplat.center` along its normal based on the noise function.
    - [ ] Ensure displacement respects the spherical topology.
- [ ] Task: Implement Energy Veins (Brightness Mapping)
    - [ ] Add GLSL logic to calculate a brightness multiplier based on noise peaks.
    - [ ] Apply this multiplier to `gsplat.rgba` to create the "vein" effect within the current status color.
- [ ] Task: Conductor - User Manual Verification 'Visual Refinement' (Protocol in workflow.md)

## Phase 3: Interactivity & Polish
- [ ] Task: Implement Hover Turbulence
    - [ ] Add a `hoverIntensity` float dyno.
    - [ ] Use GSAP in `Portal.tsx` to lerp `hoverIntensity` between `0.0` and `1.0` based on `isHovered`.
    - [ ] Update the shader to multiply noise frequency/amplitude by the `hoverIntensity`.
- [ ] Task: Performance & Quality Gate Check
    - [ ] Verify 60 FPS performance with multiple portals.
    - [ ] Ensure visual consistency across all status colors (Blue, Green, Red, White).
- [ ] Task: Conductor - User Manual Verification 'Interactivity & Polish' (Protocol in workflow.md)
