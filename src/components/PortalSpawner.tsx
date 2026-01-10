import { useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMyStore } from "../store/store";
import { characterStatus } from "bvhecctrl";
import { Vector3, Quaternion } from "three";

export const PortalSpawner = () => {
  const status = useMyStore((state) => state.status);
  const currentWorldId = useMyStore((state) => state.currentWorldId);
  const worldAnchorPosition = useMyStore((state) => state.worldAnchorPosition);
  const worldAnchorOrientation = useMyStore(
    (state) => state.worldAnchorOrientation,
  );
  const addPortal = useMyStore((state) => state.addPortal);
  const setEditingPortal = useMyStore((state) => state.setEditingPortal);
  const openPortalUI = useMyStore((state) => state.openPortalUI);
  const { camera } = useThree();

  const [subscribeKeys] = useKeyboardControls();

  useEffect(() => {
    return subscribeKeys(
      (state) => state.create_portal,
      (pressed) => {
        if (pressed && status === "playing") {
          // Get direction camera is facing
          const direction = new Vector3();
          camera.getWorldDirection(direction);

          // Flatten to XZ plane and normalize
          direction.y = 0;
          direction.normalize();

          // Scale by 1.5m
          direction.multiplyScalar(1.5);

          // Calculate global spawn position:
          // Player Pos + Direction Offset
          const globalSpawnPos = characterStatus.position
            .clone()
            .add(direction);

          // Transform to Local Coordinate System (relative to World Anchor)
          // 1. Translate
          const localPos = globalSpawnPos.sub(worldAnchorPosition);

          // 2. Rotate (Inverse of World Rotation)
          const worldQuat = new Quaternion().setFromEuler(
            worldAnchorOrientation,
          );
          worldQuat.invert();
          localPos.applyQuaternion(worldQuat);

          const newPortal = {
            id: `portal-${Date.now()}`,
            position: localPos,
            url: null,
            status: "idle" as const,
          };
          addPortal(currentWorldId, newPortal);
          setEditingPortal(currentWorldId, newPortal.id);
          openPortalUI();
        }
      },
    );
  }, [
    subscribeKeys,
    status,
    currentWorldId,
    worldAnchorPosition,
    worldAnchorOrientation,
    addPortal,
    setEditingPortal,
    openPortalUI,
    camera,
  ]);

  return null;
};
