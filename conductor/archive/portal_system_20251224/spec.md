# Spec - Portal System

## Overview
The Portal System is the central interaction point of the application. It consists of a 3D object (the "Portal") and a 2D UI overlay that allows users to input Marble API URLs to load new worlds.

## Requirements
- **3D Portal Sphere:**
    - A visible sphere in the 3D scene.
    - Clickable to trigger the URL input UI.
    - Displays textual status overlays (e.g., "IDLE", "LOADING...", "READY").
- **URL Input UI:**
    - A minimalist, high-contrast 2D overlay.
    - Contains a text input for the Marble URL and a "Confirm" button.
    - Closes or minimizes once the URL is submitted.
- **State Management:**
    - A centralized store to manage the API loading status, the current URL, and the visibility of the UI.
- **API Fetching:**
    - Logic to call the Marble API and retrieve Gaussian Splat, collision mesh, and panorama asset URLs.
- **Feedback Loop:**
    - The Portal sphere must visually update its text based on the progress of the API call.
