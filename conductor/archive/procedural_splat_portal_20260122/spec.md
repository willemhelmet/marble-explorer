# Specification: Procedural Splat Portal

## Overview
Replace the current `Sphere` visual in the `Portal` component with a procedural Gaussian Splat generated using Spark.js. This will create a distinctive, cloud-like sphere visual for the portals while maintaining existing interaction and status logic.

## Functional Requirements
- **Procedural Sphere Generation:** Use the built-in `constructSpherePoints` helper from `@sparkjsdev/spark` within a `SplatMesh` to generate an oriented splat sphere.
    - **Parameters:** Set `maxDepth` to 4 (or 5) to ensure a dense, high-quality sphere.
    - **Visuals:** Tune `pointRadius` and `pointThickness` to achieve a soft, voluminous look.
- **Dyno-based Styling:** Implement a Dyno `objectModifier` to handle real-time color updates.
- **Status Integration:** The splat's color must react to the `portal.status`:
    - **Generating:** Blue (#3b82f6)
    - **Ready:** Green (#22c55e)
    - **Error:** Red (#ef4444)
    - **Idle/Default:** White (#ffffff)
- **Interactive Consistency:** Maintain the existing `Sphere` geometry but set it to `visible={false}` to act as the raycast target for clicks and hover detection.
- **UI Simplification:** Remove the `Billboard` and `Text` status indicators; the splat's color will be the primary status communicator.

## Technical Strategy
- Reference the Spark.js documentation for `constructSpherePoints` usage.
- Use `useMemo` to initialize the `SplatMesh` once per portal instance.
- Utilize the `objectModifier` to apply the status color dynamically on the GPU.

## Acceptance Criteria
- [ ] The portal sphere is replaced by a cloud of oriented Gaussian splats.
- [ ] The splat cloud changes color correctly based on portal status (Blue/Green/Red/White).
- [ ] Clicking the splat cloud (via the hidden sphere proxy) still triggers the Portal UI.
- [ ] No floating text is visible above the portal.
- [ ] Hovering the portal still triggers the global hover state (crosshair change).

## Out of Scope
- Custom emissive/glow materials (standard splat rendering only).
- Complex animations (vortex, swirling).
