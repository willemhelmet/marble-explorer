# Implementation Plan - Remote Player Avatar Refactor

## Phase 1: Avatar Component Implementation
- [~] Task: Create new `RemoteAvatar` component (or update `RemotePlayer.tsx`)
    - [ ] Sub-task: Define the geometry hierarchy (Group -> Body Mesh -> Head Mesh).
    - [ ] Sub-task: Configure dimensions (Body: ~1.4m capsule, Head: ~0.25m sphere).
    - [ ] Sub-task: Apply materials/colors.
- [ ] Task: Implement Rotation Logic
    - [ ] Sub-task: Extract Yaw and Pitch from the server's rotation data (Euler or Quaternion).
    - [ ] Sub-task: Apply Yaw to the Body group/mesh.
    - [ ] Sub-task: Apply Pitch to the Head mesh.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Avatar Component Implementation' (Protocol in workflow.md)

## Phase 2: Integration & Verification
- [~] Task: Integrate new avatar into `RemotePlayerManager.tsx` (if separate component) or finalize updates in `RemotePlayer.tsx`.
- [ ] Task: Verify positioning alignment (feet on ground vs center point).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Integration & Verification' (Protocol in workflow.md)
