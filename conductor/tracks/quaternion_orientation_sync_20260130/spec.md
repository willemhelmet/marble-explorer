# Track Specification: Quaternion Orientation Sync & Hub Reset Fix

## Overview
Currently, remote player orientation is synchronized using Euler angles, leading to gimbal lock and a rotation offset when a player returns to the hub via a portal. This track will transition the orientation synchronization to use Quaternions and ensure that the hub return reset correctly initializes the player's orientation for all connected clients.

## Functional Requirements
- **Protocol Update:** Update the network protocol to synchronize player orientation using Quaternions instead of Euler angles.
- **Client Transmission:** Modify `Player.tsx` to send the camera's or character's quaternion to the server.
- **Remote Interpolation:** Update `RemotePlayer.tsx` to apply received quaternions to remote avatars, ensuring smooth and accurate rotation.
- **Hub Reset Logic:** Refine the teleportation logic in `Player.tsx` and `Portal.tsx` to ensure the "forward" orientation is correctly propagated to the server and reflected on all remote clients without any entry-angle offsets.
- **Server Support:** Ensure the server-side movement handling correctly broadcasts the new orientation data structure.

## Non-Functional Requirements
- **Robustness:** Eliminate gimbal lock issues in remote player visualization.
- **Accuracy:** Ensure 1:1 orientation matching between local view and remote avatar representation.

## Acceptance Criteria
- [ ] Remote players see a returning player's avatar facing exactly forward (as requested by the hub reset) without any offset.
- [ ] No gimbal lock (erratic flipping/spinning) occurs when looking straight up or down.
- [ ] Orientation remains synchronized and accurate across all world transitions.

## Out of Scope
- Implementing full-body networking (IK/animations).
- Optimizing bandwidth usage (e.g., quaternion compression).
