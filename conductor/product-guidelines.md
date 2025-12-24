# Product Guidelines - Marble API World Loader

## Visual Identity & Tone
- **Minimalist & Futuristic:** The overall aesthetic should be clean, precise, and tech-focused. Use a high-contrast palette (primarily Black, White, and a singular accent color like Electric Blue).
- **Precision Typography:** Use clean, monospaced or sans-serif fonts to reinforce the technical nature of the demo.

## User Interface (2D & 3D)
- **Diegetic Portal (3D):**
    - The portal sphere acts as the primary interactive element in 3D space.
    - **Feedback:** Use minimalist floating text overlays directly above or on the sphere to communicate API states (`IDLE`, `FETCHING...`, `INITIALIZING...`, `READY`, `ERROR`).
- **Input System (2D):**
    - **Style:** Flat, high-contrast UI components. Sharp edges, solid backgrounds, and clear borders.
    - **Interaction:** Triggered by clicking the 3D portal. The input field should autofocus and provide a clear "Confirm" action.
- **State Feedback:** Provide immediate visual confirmation for all user actions (clicking the sphere, submitting the URL).

## Experience & Interaction
- **Transition Logic:**
    - Entry into the world should be an **Instantaneous Snap**. Once the player crosses the threshold of the "Ready" portal, they are immediately transitioned into the full-scale environment.
- **Navigation:** 
    - First-person controls should feel responsive and weighted.
    - Collision feedback should be clear but unobtrusive, preventing clipping through walls defined by the loaded mesh.
- **World Rendering:**
    - The Gaussian Splats and panorama data should be rendered "as-is" without additional stylistic filters, ensuring the focus remains on the accuracy and fidelity of the Marble API's output.

## Technical Standards
- **Performance:** Prioritize a smooth frame rate (60 FPS) even during asset loading. Use asynchronous loading patterns to avoid blocking the main thread.
- **Robustness:** Gracefully handle edge cases like malformed URLs, network timeouts, or missing assets in the API response.
