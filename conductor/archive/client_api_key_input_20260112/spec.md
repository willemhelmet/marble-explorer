# Specification: Client-Side API Key Input

## Overview
This track implements a required API key entry screen. Users must provide their own Marble API Key to play the game. The key will be stored in `localStorage` for persistence and used for all world data fetching.

## Functional Requirements
- **Main Menu Update:** Update the existing `MainMenu` component to include a required API key input field using a new `ApiInput` component.
    - The "Start" button must be disabled until a valid-looking key is entered.
- **Validation:** 
    - Basic client-side validation: Ensure the input is a 32-character alphanumeric string.
- **Persistence:** 
    - Save the API key to `localStorage` upon successful entry.
    - On subsequent loads, auto-fill the input field from `localStorage`.
- **API Integration:**
    - Update `src/services/apiService.ts` to retrieve the key from the global store/localStorage instead of relying solely on `import.meta.env`.
- **UI/UX:**
    - Add an "Edit Key" option in the `PauseMenu` to allow users to update their credentials.

## Non-Functional Requirements
- **Security:** Ensure the key is only stored in `localStorage` and never sent to the project's own backend.
- **User Privacy:** Provide a clear "Clear Stored Key" action.

## Acceptance Criteria
- [x] Users cannot click "Start" in the main menu without a valid-looking API key.
- [x] Entered keys persist across page refreshes.
- [x] The world-loading functionality works correctly using the user-provided key.
- [x] Users can change or clear their key from within the game (e.g., in the Pause Menu).
