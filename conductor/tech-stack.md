# Tech Stack - Marble API World Loader

## Core Framework & Build Tools
- **Language:** [TypeScript](https://www.typescriptlang.org/) - For type-safe development.
- **Frontend Framework:** [React 19](https://react.dev/) - UI library for building the interface and managing component state.
- **Build Tool:** [Vite](https://vitejs.dev/) - Fast development server and build pipeline.

## Backend & Real-time
- **Server:** [Node.js](https://nodejs.org/) - JavaScript runtime for the multiplayer backend.
- **Real-time Communication:** [Socket.IO](https://socket.io/) - For bi-directional, event-based communication.
- **Database:** [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) - High-performance, synchronous SQLite library for persistent storage.

## 3D Rendering & Physics
- **3D Engine:** [Three.js](https://threejs.org/) - The underlying WebGL engine.
- **React Integration:** [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei) - React reconciler for Three.js and useful helpers.
- **Gaussian Splatting:** [@sparkjsdev/spark](https://github.com/sparkjsdev/spark) - High-performance Gaussian Splat renderer.
- **Character Controller & Physics:** [bvhecctrl](https://github.com/mkkellogg/BVH-Evidence-Character-Controller) - For responsive first-person movement and collision detection.

## State Management & Animation
- **Global State:** [Zustand](https://docs.pmnd.rs/zustand) - Lightweight state management for API status and world transitions.
- **Animation:** [GSAP](https://gsap.com/) & [@gsap/react](https://gsap.com/resources/React/) - For UI transitions and the portal's visual state changes.

## Styling & UI
- **CSS Framework:** [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first styling for the 2D UI.
- **UI Tweaks:** [Leva](https://github.com/pmndrs/leva) - For rapid prototyping of 3D parameters (if needed).

## Deployment
- **Hosting:** [GitHub Pages](https://pages.github.com/) - Using `gh-pages` for automated deployment.
