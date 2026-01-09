# Specification: Fix Portal Transition Logic

## Overview
This track addresses two related issues:
1.  **Premature Asset Loading:** `PortalUI.tsx` currently forces a world switch immediately upon URL submission.
2.  **Legacy Navigation Logic:** `Portal.tsx` contains hardcoded/legacy logic for navigation (`handleNavigation`) that needs to be robust enough to handle dynamic world switching based on the portal's stored URL.

The goal is to move the "world switch" responsibility entirely to the `Portal` component's traversal event, ensuring the UI only configures the portal's metadata.

## Functional Requirements
1.  **PortalUI Update:**
    *   `handleSubmit` in `PortalUI.tsx` MUST NOT call `setAssets`.
    *   It MUST ONLY update the portal's registry entry (URL and status).
    *   It SHOULD optionally validate the URL (fetch metadata) but NOT load heavy assets.

2.  **Portal Navigation Logic:**
    *   The `handleNavigation` function in `Portal.tsx` MUST be the sole trigger for:
        *   Fetching world assets for the target URL.
        *   Calling `setAssets` to update the renderer.
        *   Calling `switchWorld` to update the game state.
        *   Updating `worldAnchorPosition`.
    *   This logic MUST handle both "Hub" destination (resetting assets) and dynamic URL destinations.

## Refactoring Scope
-   **File:** `src/components/ui/PortalUI.tsx` - Remove `setAssets` call.
-   **File:** `src/components/Portal.tsx` - Verify and refine `handleNavigation` to ensure it cleanly fetches and sets assets only when triggered by player proximity.

## Acceptance Criteria
- [ ] Submitting a URL in the UI updates the portal to "Ready" but does *not* change the currently rendered world.
- [ ] Entering a configured portal triggers the fetch, loads the new world, and switches the view.
- [ ] The transition logic handles errors (e.g., failed fetch) gracefully without leaving the user in a broken state.
