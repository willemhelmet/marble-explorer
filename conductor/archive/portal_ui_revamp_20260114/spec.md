# Specification: Portal UI Revamp

## Overview
Revamp the `PortalUI.tsx` component to support an expanded feature set including world generation and portal management. The UI will transition from a single-field input to a tabbed interface, providing a scalable foundation for future enhancements.

## Functional Requirements

### 1. Tabbed Navigation
- Implement a tabbed interface with three primary sections:
    - **Connect:** Load an existing world via URL (current functionality).
    - **Generate:** Create a new world using text prompts or image inputs.
    - **Manage:** Administrative actions for the portal (e.g., Deletion).

### 2. "Connect" Tab (Legacy URL Load)
- Preserve the existing URL input field and submission logic.
- Ensure it continues to work with `socketManager.createPortal` or `updatePortal` logic.

### 3. "Generate" Tab (New Feature)
- **Text Prompt Input:** A multi-line text area for descriptive world prompts.
- **Image Input:** A file input or drop zone to provide a reference image for generation.
- **Engage Button:** Triggers the generation process. *Note: Full polling and operation management may be handled in a subsequent track, but the UI must support the initial request.*

### 4. "Manage" Tab (Portal Controls)
- **Delete Portal Button:** A high-visibility button to remove the portal from the world.
- **Deletion Confirmation:** A secondary confirmation step (modal or overlay) to prevent accidental removal.

### 5. UI/UX Design
- Adhere to the existing "Brutalist/Mono" aesthetic:
    - High contrast (Black/White).
    - Monospaced fonts.
    - Sharp borders and minimal decoration.
- Ensure the UI is centered and responsive for mobile users.

## Acceptance Criteria
- [ ] Users can toggle between Connect, Generate, and Manage tabs.
- [ ] Pasting a valid URL in the Connect tab successfully updates/creates a portal.
- [ ] Text and Image inputs in the Generate tab are captured and ready for API integration.
- [ ] Clicking "Delete" in the Manage tab triggers a confirmation dialog.
- [ ] Confirming deletion successfully calls the server to remove the portal.

## Out of Scope
- Implementing the 5-minute polling logic for world generation progress.
- Multi-image or Video generation inputs (saved for future tracks).
