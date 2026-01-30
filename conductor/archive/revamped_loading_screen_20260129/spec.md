# Track Specification - Revamped Loading Screen

## Overview
The goal of this track is to revamp the application's loading screen from its default, bare-bones state to a minimalist, sleek, and branded experience. The new loader will use a solid black background, the project's custom "Karrik" font, and display the world's `display_name` along with a simple progress percentage.

## Functional Requirements
- **Solid Black Background:** The loading overlay must have a background color of `#000`.
- **Branded Typography:** All text (world name and progress percentage) must use the "Karrik" font.
- **World Name Display:** Retrieve and display the `display_name` of the world being loaded.
- **Progress Tracking:** Display a thin progress bar and a percentage text (e.g., "45%").
- **Centered Layout:** The world name, progress bar, and percentage text must be stacked and centered on the screen.
- **Visual Style:** 
    - World name should be in a larger, prominent font.
    - Progress bar should be thin and minimalist.
    - Percentage text should be positioned below the bar.

## Technical Requirements
- **Loader Component Customization:** Utilize the existing `<Loader>` component's props (`containerStyles`, `innerStyles`, `barStyles`, `dataStyles`, `dataInterpolation`) in `src/App.tsx`.
- **State Management:** Ensure the `display_name` is correctly passed to the loading state or accessed from the relevant slice (e.g., `worldSlice`).
- **CSS Transitions:** Maintain or improve the smooth opacity transition (300ms) when the loader appears or disappears.

## Acceptance Criteria
- The loading screen has a solid black background.
- The "Karrik" font is applied to all text.
- The world's display name is visible when available.
- A minimalist progress bar and percentage are centered on the screen.
- The transition between the loader and the 3D scene is smooth.

## Out of Scope
- Adding complex animations or 3D elements to the loading screen.
- Detailed per-asset loading breakdowns (e.g., individual file sizes).
