# Specification: Mobile Portal Creation Button

## Overview
This track implements the functionality for the "Create Portal" virtual button on mobile devices. When pressed, the button will trigger the portal creation UI by setting the game status to `portal_open`.

## Functional Requirements
- **Portal Spawner Integration:** The `PortalSpawner.tsx` component will be updated to listen for the `create-portal` virtual button press events.
- **Mobile Input Detection:** Use the `useButtonStore` hook from `bvhecctrl` to detect the state of the virtual button with ID `create-portal`.
- **Debounced Interaction:** Implement a `useRef` and `useEffect` pattern to ensure the `openPortalUI` action is only triggered once per press (on the leading edge).
- **Conditional Trigger:** The button should only trigger `openPortalUI()` if the current game status is `playing`.

## Non-Functional Requirements
- **Maintainability:** Keep input logic centralized in `PortalSpawner.tsx` alongside keyboard input logic.
- **Performance:** Minimal impact on the render loop by using targeted store selectors and refs.

## Acceptance Criteria
- [ ] On mobile devices, clicking the "Create Portal" button (plus icon) opens the portal URL input UI.
- [ ] The button only works when the game is in the `playing` state.
- [ ] Pressing the button repeatedly only triggers the UI once per distinct press.
- [ ] Keyboard "E" (or configured `create_portal` key) continues to work as expected on non-mobile devices.

## Out of Scope
- Visual styling of the `VirtualButton` (already handled in `MobileControls.tsx`).
- Implementation of the `portal_open` state or UI (already exists).
