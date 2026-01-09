# Specification: Fix Portal Render Loop

## Overview
After refactoring `Scene.tsx` and `WorldContent.tsx` to isolate rendering, the application crashes with "Maximum update depth exceeded". Analysis reveals that `Portal.tsx` subscribes to the *entire* store state using `useMyStore()`. When a portal updates `isHovered` in the store, it triggers a re-render of *all* portals, which in turn might re-trigger the effect, causing a loop or massive performance degradation.

## Core Problem
- `Portal.tsx` uses `const { ... } = useMyStore()`. This subscribes the component to *every* change in the store.
- When `setIsHovered` is called, the store updates.
- All Portals re-render.
- If this triggers another update (e.g., via `useEffect` or parent re-render), an infinite loop occurs.

## Functional Requirements
1.  **Atomic Subscriptions:** `Portal.tsx` must use atomic selectors (e.g., `useMyStore(s => s.action)`) for all store access.
2.  **Performance:** Hovering a portal should *only* re-render that specific portal and the UI components that depend on `isHovered`, not the entire world or other portals.

## Acceptance Criteria
- [ ] Application does not crash with "Maximum update depth exceeded".
- [ ] Hovering a portal is performant.
- [ ] Entering a portal works correctly without crashes.
