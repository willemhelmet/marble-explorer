# Track Specification: Hub Portal Return Reset

## Overview
Currently, when a player enters a portal pointing back to the "hub", the world assets are cleared, but the player's physical position in the scene remains unchanged. This can lead to the player being "lost" in the void or spawning far from the hub's central area. This track implements a position and physics reset to ensure a consistent experience when returning to the lobby.

## Functional Requirements
- **Navigation Logic Update:** Modify `handleNavigation` in `Portal.tsx` to detect when the destination is `"hub"`.
- **Player Teleportation:** Upon hub entry, set the player's absolute position to `[0, 0.8, 5]`.
- **Orientation Reset:** Reset the player's rotation to a neutral, forward-facing state.
- **Physics Cleanup:** Explicitly clear the character's velocity and momentum to prevent drifting or erratic movement immediately after the teleport.

## Non-Functional Requirements
- **Consistency:** The reset position must match the initial spawn position defined in `Player.tsx`.
- **Seamlessness:** The reset should happen during the transition/loading phase to avoid a jarring visual "snap" if possible.

## Acceptance Criteria
- [ ] Entering a "hub" portal correctly transitions the scene back to the lobby.
- [ ] The player is teleported to `[0, 0.8, 5]` upon arrival.
- [ ] The player is facing forward after the teleport.
- [ ] The player has zero velocity upon arrival (no sliding/drifting).

## Out of Scope
- Adding new UI for the transition (reusing existing loading screen logic).
- Changing the hub environment itself.
