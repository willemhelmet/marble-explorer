# Plan - Portal System

## Phase 1: Foundation & State
- [x] Task: Define the `useWorldStore` in `src/store/` to manage portal state (URL, loadingStatus, isUIVisible).
- [ ] Task: Create a basic `Portal` component in `src/components/` that renders a sphere.
- [ ] Task: Implement the `PortalUI` 2D component with the URL input field.

## Phase 2: Interaction & API
- [ ] Task: Implement click interaction on the `Portal` sphere to toggle `PortalUI` visibility.
- [ ] Task: Create an `apiService` to handle Marble API requests and parse the response.
- [ ] Task: Connect the `PortalUI` confirm button to the `apiService`.

## Phase 3: Visual Feedback & Cleanup
- [ ] Task: Add 3D text overlays (using Drei's `Text`) to the `Portal` sphere to show current state.
- [ ] Task: Implement cleanup logic to ensure assets are disposed of when a new URL is loaded.

## Phase 4: Verification
- [ ] Task: Conductor - User Manual Verification 'Portal System' (Protocol in workflow.md)
