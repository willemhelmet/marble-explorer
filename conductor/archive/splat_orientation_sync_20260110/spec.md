# Specification: Synchronize Splat Orientation on Portal Entry

## Overview
Currently, when a player enters a portal, the new world is anchored to their position, but its orientation is static or calculated incorrectly. This results in the player often facing an undesirable direction (e.g., a wall) instead of the intended "forward" view of the splat. This feature ensures that the splat's default "forward" direction (-Z axis) aligns with the player's horizontal forward vector at the moment of traversal.

## Functional Requirements
1. **Y-Axis Alignment:** Upon portal entry, the world's orientation must be updated such that its internal -Z axis points in the same direction the player was facing.
2. **Floor Stability:** The rotation must be restricted strictly to the Y-axis (yaw). X (pitch) and Z (roll) rotations must be zeroed out to ensure the floor remains perfectly level.
3. **Store Integration:** The calculated orientation must be stored in the `worldAnchorOrientation` state within the `portalSlice`.
4. **Consistency:** The behavior must be consistent regardless of the player's approach angle (North, South, East, or West).

## Technical Strategy
- **Source Data:** Use `characterStatus.quaternion` from the `bvhecctrl` state to determine the player's current orientation.
- **Calculation:** 
    - Convert the quaternion to Euler angles.
    - Extract the Y-component (yaw).
    - Apply this Y-rotation to the `worldAnchorOrientation`.
- **Debugging:** Add console logs to track the player's input quaternion and the resulting Euler Y-rotation being applied to the store.

## Acceptance Criteria
- [ ] Entering a portal while facing any horizontal direction results in the player looking "into" the splat's -Z axis.
- [ ] The floor remains perfectly horizontal after rotation.
- [ ] Entering from the +X, -X, and +Z directions no longer defaults to a +Z orientation.

## Out of Scope
- Smoothing or animating the rotation transition (instant snap is expected).
- Handling non-flat floor orientations (e.g., walking on walls).
