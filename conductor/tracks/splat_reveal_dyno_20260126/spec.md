# Specification - Splat Reveal Effect Dyno

## Overview
Implement a procedural "reveal" effect for Gaussian splats using the Spark Dyno system. When a new world is loaded, the splat will programmatically expand from the player's current position, accompanied by a cyan glow and a slight geometric pulse at the leading edge of the expansion.

## Functional Requirements

### 1. Reveal Dyno Implementation
- Create a new Spark Dyno (e.g., `RevealDyno`) that accepts:
    - `origin` (vec3): The center point of the reveal.
    - `revealProgress` (float): A value from 0.0 to 1.0 controlling the expansion radius.
- Implement the GLSL logic for:
    - **Visibility Masking:** Hiding splats beyond the current radius.
    - **Cyan Glow:** A cyan ring at the expansion boundary.
    - **Geometric Displacement:** A slight translation and scale "pulse" at the expansion boundary using the `getSphericalGlow` logic provided.

### 2. Integration & Animation
- Update the `Splat` component to utilize this Dyno.
- Use **GSAP** to animate the `revealProgress` uniform from `0` to `1` immediately after the splat file has successfully loaded.
- Animation settings:
    - **Duration:** 2.0 seconds (approx).
    - **Easing:** `power2.out`.
- Synchronize the `origin` uniform with the player's position retrieved from `characterStatus.position` (from `bvhecctrl`).

### 3. Lifecycle Management
- Ensure the reveal effect triggers for every new world/splat loaded.
- Properly dispose of the animation or reset uniforms when the world changes to prevent visual artifacts or state leaks.

## Non-Functional Requirements
- **Performance:** The shader logic should be efficient to maintain high frame rates during the animation.
- **Smoothness:** Ensure no stuttering during the expansion.

## Acceptance Criteria
- [ ] A new world load triggers a reveal animation starting from the player's position.
- [ ] The animation displays a cyan glowing edge that expands to reveal the full environment.
- [ ] After ~2 seconds, the environment is fully visible and the glow disappears (or stays at the far boundary).
- [ ] Movement during the reveal is reflected by the `origin` point (reveal expands relative to the player's current location).

## Out of Scope
- Cross-fading between two different splat files (this track focuses on revealing a single splat).
- Modifying the world mesh collider reveal (only the visual splat).
