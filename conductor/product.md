# Product Guide - Marble API World Loader

## Initial Concept
This project is a personal technical demo designed to explore the integration of World Lab's Marble API. The goal is to build a robust system for fetching and displaying Gaussian Splat files, collision meshes, and panorama images from a user-provided URL.

## Target Users
- **Primary:** The developer (me), as a learning exercise and template for future, more complex projects.
- **Secondary:** End-users who want a seamless, immersive way to explore "worlds" generated via the Marble API by simply pasting a link.

## Core Goals
- **UX Exploration:** Design a clean, intuitive interaction model for inputting URLs and receiving feedback during the data fetch process.
- **Architectural Experimentation:** Identify and solve the challenges of dynamic asset loading and state management in a 3D environment.
- **Repeatable Design:** Establish a high-quality interaction pattern (the "Portal" concept) that can be reused in subsequent projects.

## Key Features
- **Diegetic Portal UI:** A floating 3D sphere that, when clicked, opens a 2D UI for URL input.
- **Dynamic API Interaction:** Real-time fetching of world data (splat, mesh, pano) upon URL confirmation.
- **Visual State Feedback:** The portal sphere undergoes visual transformations (animations, color changes, or text) to reflect the API's current status (idle, loading, success, or failure).
- **Seamless World Transition:** The portal displays the fetched panorama image once loading is complete.
- **Immersive Exploration:** First-person (WASD + Mouse) movement allowing the user to walk into the portal to view the loaded world, with physics-based collisions against the downloaded mesh.
- **Lifecycle Management:** Gracefully handling URL switches by disposing of old assets and initializing new ones without memory leaks or state conflicts.

## Technical Challenges
- **State Synchronization:** Maintaining a clean link between the 2D UI input, the 3D portal's visual state, and the background API/loading processes.
- **Asset Integration:** Efficiently loading and rendering disparate data types (Splat, Mesh, Image) into a cohesive 3D scene.
