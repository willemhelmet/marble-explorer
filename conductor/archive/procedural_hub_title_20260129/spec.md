# Specification: Procedural Hub Title Splat

## Overview
Implement a procedural text-based Gaussian Splat in the central hub environment to display the title "Marble Explorer". This adds a branded, diegetic element to the starting scene using the `@sparkjsdev/spark` text rasterization utility.

## Functional Requirements
- **Text Rasterization:** Use the `textSplats` utility from `@sparkjsdev/spark` to generate a `SplatMesh` containing the text "Marble Explorer".
- **Hub Integration:** Place the text splat within the `<Hub />` component or as a separate component rendered within the `Scene` when in the "hub" state.
- **Visual Configuration:**
  - **Text:** "Marble Explorer"
  - **Color:** Classic White (`rgb: [1, 1, 1]`)
  - **Position:** Floating above the central spawn point (approx. y=3 or y=4).
  - **Orientation:** Static and forward-facing (facing the player's initial entry vector).
- **Scale:** Adjusted to ensure the title is prominent but does not overwhelm the environment.

## Non-Functional Requirements
- **Performance:** Since this is procedural, ensure it is initialized once and does not cause frame drops during rasterization.
- **Asset Integrity:** The text should remain crisp and readable within the 3D environment.

## Acceptance Criteria
- [ ] The text "Marble Explorer" is visible in the hub upon loading.
- [ ] The text is positioned high enough to serve as a title without obstructing movement.
- [ ] The text correctly uses Gaussian splats for rendering (matching the aesthetic of the environment).
- [ ] The implementation does not break existing portal or movement logic.

## Out of Scope
- Interactive text (hover/click).
- Complex animations (pulsing/floating) for this initial version.
- Multi-line text support (beyond the single title).