import { useRef } from "react";
import { Sphere, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMyStore } from "../store/store";
import { characterStatus } from "bvhecctrl";
import { Vector3, Group } from "three";
import type { ThreeElements } from "@react-three/fiber";

export const Portal = (props: ThreeElements['group']) => {
  const portalStatus = useMyStore((state) => state.portalStatus);
  const isInsideRef = useRef(false);
  const groupRef = useRef<Group>(null);

  // Determine color based on status
  let color = "gray";
  switch (portalStatus) {
    case "idle":
      color = "blue";
      break;
    case "fetching":
    case "initializing":
      color = "orange";
      break;
    case "ready":
      color = "green";
      break;
    case "error":
      color = "red";
      break;
  }

  useFrame(() => {
    if (groupRef.current) {
      // Get portal world position
      const portalPos = new Vector3();
      groupRef.current.getWorldPosition(portalPos);

      // Calculate distance to player
      // characterStatus.position is a Vector3
      const dist = portalPos.distanceTo(characterStatus.position);

      const threshold = 1.5; // Adjust as needed based on sphere size and player size

      if (dist < threshold) {
        if (!isInsideRef.current) {
          console.log("Player entered portal");
          isInsideRef.current = true;
        }
      } else {
        isInsideRef.current = false;
      }
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <Sphere>
        <meshBasicMaterial color={color} />
      </Sphere>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {portalStatus}
      </Text>
    </group>
  );
};
