# Specification: Remote Player Avatar Refactor

## Overview
This track replaces the placeholder remote player avatar (a single pink capsule) with a two-part hierarchical model consisting of a **Body** (Capsule) and a **Head** (Sphere). The new model will accurately reflect the remote player's gaze by splitting yaw and pitch rotations between the body and head.

## Functional Requirements
1.  **Hierarchical Model:**
    *   **Body:** A capsule mesh representing the torso/legs.
    *   **Head:** A sphere mesh parented to the Body.
2.  **Rotation Logic:**
    *   **Body (Yaw):** The body group/mesh will rotate on the Y-axis based on the player's camera yaw.
    *   **Head (Pitch):** The head mesh will rotate on the X-axis based on the player's camera pitch.
    *   Inheritance: The head will inherit the body's yaw rotation.
3.  **Visuals & Scale:**
    *   **Total Height:** ~1.7m.
    *   **Body Dimensions:** Capsule approx 1.4m height.
    *   **Head Dimensions:** Sphere approx 0.25m radius.
    *   **Color:** Simple distinction between body and head (e.g., darker/lighter tones) while maintaining the prototype aesthetic.
4.  **Positioning:** The player's root position must match the position data received from the server.

## Non-Functional Requirements
-   **Performance:** Maintain efficient rendering for multiple remote players.
-   **Smoothness:** Ensure rotation updates are applied smoothly (though current socket sync frequency is the bottleneck).

## Acceptance Criteria
-   Remote players are rendered as a capsule body with a sphere head.
-   When a remote player looks left/right, their body rotates.
-   When a remote player looks up/down, only their head rotates.
-   Scale and positioning are consistent with the world and other player interactions.

## Out of Scope
-   Walking animations or limb movement.
-   Character customization (hats, skins, etc.).
-   Interpolation/Extrapolation for movement smoothing (unless required for basic functionality).
