# Implementation Plan - Splat Reveal Effect Dyno

This plan outlines the steps to implement a procedural reveal effect for Gaussian splats using a custom Spark Dyno, GSAP animations, and player-centric positioning.

## Phase 1: Reveal Dyno Development [checkpoint: 8420632]
- [x] Task: Create the `RevealDyno` shader logic in `src/dynos/revealDyno.ts` following the provided GLSL template.
- [x] Task: Write a unit test to ensure the `RevealDyno` can be successfully instantiated and its uniforms are correctly defined.
- [x] Task: Implement the `getSphericalGlow`, `calculateColor`, `calculateTranslation`, and `calculateScale` functions within the Dyno.
- [x] Task: Conductor - User Manual Verification 'Reveal Dyno Development' (Protocol in workflow.md)
- [ ] Task: Implement the `getSphericalGlow`, `calculateColor`, `calculateTranslation`, and `calculateScale` functions within the Dyno.
- [ ] Task: Conductor - User Manual Verification 'Reveal Dyno Development' (Protocol in workflow.md)

## Phase 2: Splat Component Integration
- [ ] Task: Modify `src/components/marble/Splat.tsx` to import and apply the `RevealDyno`.
- [ ] Task: Create a mechanism to track `revealProgress` state within the `Splat` component (using a ref for performance with GSAP).
- [ ] Task: Update the `useFrame` loop or a dedicated effect in `Splat.tsx` to sync the `origin` uniform with `characterStatus.position`.
- [ ] Task: Write a test to verify that the `Splat` component correctly initializes the Dyno when a splat URL is provided.
- [ ] Task: Conductor - User Manual Verification 'Splat Component Integration' (Protocol in workflow.md)

## Phase 3: Animation & Lifecycle
- [ ] Task: Implement the GSAP animation trigger in `Splat.tsx` that fires when the splat is fully loaded.
- [ ] Task: Ensure the `revealProgress` resets and the animation restarts whenever a new world (splat URL) is loaded.
- [ ] Task: Add a cleanup phase to the animation effect to prevent memory leaks or overlapping GSAP tweens.
- [ ] Task: Conductor - User Manual Verification 'Animation & Lifecycle' (Protocol in workflow.md)

## Phase 4: Polish & Performance
- [ ] Task: Fine-tune the glow thickness and displacement strength for optimal visual impact.
- [ ] Task: Verify that the animation runs smoothly at 60fps on mobile and desktop.
- [ ] Task: Final code review and documentation update.
- [ ] Task: Conductor - User Manual Verification 'Polish & Performance' (Protocol in workflow.md)
