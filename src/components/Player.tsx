import BVHEcctrl, { characterStatus } from "bvhecctrl";
import { useThree, useFrame } from "@react-three/fiber";
import { useMyStore } from "../store/store.ts";
import { socketManager } from "../services/socketManager";
import { useRef } from "react";

export const Player = () => {
  const camera = useThree((state) => state.camera);
  const status = useMyStore((state) => state.status);
  const paused = status !== "playing";
  const lastSendTime = useRef(0);

  useFrame((state) => {
    if (!paused) {
      // Ensure YXZ order to avoid gimbal lock when extracting Yaw/Pitch
      if (camera.rotation.order !== "YXZ") {
        camera.rotation.order = "YXZ";
      }

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
        socketManager.sendMovement(characterStatus.position, camera.rotation);
        lastSendTime.current = now;
      }
    }
  });

  return (
    <BVHEcctrl
      position={[0, 0.8, 5]}
      debug={false}
      paused={paused}
      delay={0.5}
    />
  );
};
