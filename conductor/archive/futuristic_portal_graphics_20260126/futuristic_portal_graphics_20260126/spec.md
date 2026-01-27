# Specification - Futuristic Noise-Driven Portal Graphics

## Overview
Enhance the procedural Gaussian Splat portal visuals with a dynamic, noise-driven idle animation system. This update moves beyond the static splat sphere to create a "living" entity that pulses, ripples, and reacts energetically to user focus, reinforcing a futuristic and interactive aesthetic.

## Goals
- **Organic Motion:** Replace static geometry with noise-driven displacement and scaling.
- **Atmospheric Depth:** Implement "energy veins" through noise-mapped brightness variations.
- **Interactive Feedback:** Provide a clear visual state change when the user hovers over the portal.
- **Maintain State Clarity:** Ensure the noise effects work within the existing color-coded status system (Blue=Generating, Green=Ready, etc.).

## Functional Requirements

### 1. Idle Animation System
- **Rhythmic Pulse:** The portal should "breathe" using a slow, rhythmic scale modulation.
- **Surface Ripples:** Implement noise-driven positional displacement to create waves across the splat sphere's surface.
- **Unified Noise Mapping:** A single or layered noise function should drive:
    - **Displacement:** Shifting splats along their normals.
    - **Scaling:** Modulating splat size based on noise intensity.
    - **Energy Veins:** Increasing color brightness/luminance at noise peaks to create high-energy "veins".

### 2. Interactive States
- **Hover Turbulence:** When `isHovered` is true, increase the frequency and amplitude of the noise functions to create a more turbulent, energetic appearance.
- **Smooth Transitions:** Use GSAP or lerping to transition noise parameters between "Idle" and "Hover" states to avoid visual snapping.

### 3. Technical Implementation
- **Dyno-Based Animation:** Utilize `dyno.Dyno` within the `objectModifier` block to inject GLSL shaders.
- **GLSL Globals:** Define noise functions (e.g., Simplex or Perlin noise) in the `globals` section of the `Dyno` object.
- **Vertex Transformation:**
    - Update `gsplat.center` in `statements` using a `noise-driven displacement` function.
    - Update `gsplat.rgba` or `gsplat.scale` to reflect "Energy Veins" and rhythmic pulsing.
- **Real-time Updates:** Use the `onFrame` hook to update a `dyno.dynoFloat(t)` value to drive the temporal component of the noise.

## Non-Functional Requirements
- **Visual Consistency:** The "Energy Veins" must respect the base status color (e.g., bright green veins on a green portal, bright blue on blue).
- **FPS Stability:** Maintain 60 FPS during heavy noise modulation.

## Out of Scope
- Changing the core Portal UI (tabs, input fields).
- Modifying the underlying asynchronous polling or navigation logic.
