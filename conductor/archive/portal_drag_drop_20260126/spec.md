# Specification - Portal Drag and Drop

## Overview
Implement a "drag and drop" functionality for portals, allowing users to reposition them in 3D space. This feature provides an intuitive way to fix portal placement errors. Repositioning is achieved by holding the left mouse button while the crosshair is over a portal and moving the camera.

## Functional Requirements

### 1. Drag Trigger & Interaction
- **Trigger:** Holding the Left Mouse Button (LMB) while the crosshair is over a `Portal`.
- **Capture:** At the start of the drag, the system must capture the current distance from the camera to the portal center.
- **Continuous Movement:** While LMB is held, the portal's world position updates to maintain that fixed distance relative to the camera's position and orientation.
- **Release (Drop):** Releasing the LMB "drops" the portal at its current position.

### 2. Portal State Management
- **Disabled During Move:** While a portal is being dragged, it must enter a "Moving" status.
- **Teleportation Lock:** The logic that triggers world transitions (`handleNavigation`) must be disabled for any portal in the "Moving" state to prevent accidental teleportation.

### 3. Real-time Synchronization
- **Server Updates:** The portal's updated position must be emitted to the server via the `update_portal` socket event during the drag process (likely throttled for performance) and definitely upon the final drop.
- **Multiplayer Visibility:** Other connected clients should see the portal move in real-time as the dragging user repositions it.

## Visual & Interactive States

### 1. "Moving" Visual Feedback
When a portal is being dragged, the following visual modifications are applied to the procedural splat:
- **Opacity:** The portal becomes semi-transparent.
- **Saturation:** The status color is significantly desaturated.
- **Animations:** The dynamic noise-driven idle animations ("Energy Veins" and surface ripples) are suppressed or significantly dampened.
- **Scale:** The portal slightly shrinks (e.g., to 80% of its original size) to signify it is being "held".

## Technical Strategy
- **Zustand Store:** Utilize the `WorldSlice` to track the "active drag" state.
- **Three.js / React-Three-Fiber:** 
    - Use `onPointerDown` on the portal's interaction proxy to initiate the drag.
    - Update the `uPortalPos` uniform and the group position in the `onFrame` loop while dragging.
- **GSAP:** Use GSAP to transition the visual uniforms (alpha, saturation, scale) between the standard and "Moving" states.

## Acceptance Criteria
- [ ] Users can successfully move a portal by holding LMB and moving their view.
- [ ] Portals cannot be walked through while they are being moved.
- [ ] The portal's visual appearance changes clearly (transparent, desaturated, smaller) during the drag.
- [ ] Other players see the portal move in real-time.
- [ ] Releasing LMB stops the movement and persists the new position.

## Out of Scope
- Snapping portals to surfaces or floors (movement is free 3D).
- Rotating portals while dragging (orientation remains fixed or automated).
- Dragging portals using touch controls (focused on mouse/pointer lock for now).
