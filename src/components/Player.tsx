import BVHEcctrl, { characterStatus, type BVHEcctrlApi } from "bvhecctrl";
import { useThree, useFrame } from "@react-three/fiber";
import { useMyStore } from "../store/store.ts";
import { socketManager } from "../services/socketManager";
import { useEffect, useRef } from "react";

export const Player = () => {
  const camera = useThree((state) => state.camera);
  const status = useMyStore((state) => state.status);
  const teleportRequest = useMyStore((state) => state.teleportRequest);
  const clearTeleportRequest = useMyStore((state) => state.clearTeleportRequest);

  const paused = status !== "playing";
  const lastSendTime = useRef(0);
  const ecctrlApi = useRef<BVHEcctrlApi>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    camera.rotation.order = "YXZ";
  }, [camera]);

  // Handle teleportation requests
  useEffect(() => {
    if (teleportRequest && ecctrlApi.current) {
      const { position, rotation } = teleportRequest;

      // 1. Teleport the character group (physics body)
      if (ecctrlApi.current.group) {
        ecctrlApi.current.group.position.copy(position);
      }

      // 2. Clear any existing velocity/momentum
      ecctrlApi.current.resetLinVel();

      // 3. Reset camera rotation to the requested orientation
      camera.quaternion.copy(rotation);

      // 4. Immediately sync movement to server so others see the teleport result instantly
      socketManager.sendMovement(position, rotation);

      // 5. Consume the request
      clearTeleportRequest();
    }
  }, [teleportRequest, camera, clearTeleportRequest]);

  useFrame((state) => {
    if (!paused) {
      // Update camera position to follow the player
      camera.position.copy(characterStatus.position);
      camera.position.set(
        camera.position.x,
        camera.position.y + 0.8,
        camera.position.z,
      );

      // Throttled movement sync (20Hz / every 50ms)
      const now = state.clock.getElapsedTime();
      if (now - lastSendTime.current > 0.05) {
        socketManager.sendMovement(characterStatus.position, camera.quaternion);
        lastSendTime.current = now;
      }
    }
  });

  return (
    <BVHEcctrl
      ref={ecctrlApi}
      position={[0, 0.8, 5]}
      debug={false}
      paused={paused}
      delay={0.5}
    />
  );
};
