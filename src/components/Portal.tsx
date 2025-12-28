import { useState, useEffect, useRef } from "react";
import { Sphere, Text } from "@react-three/drei";
import { useMyStore } from "../store/store";
import { useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

export const Portal = (props: ThreeElements["group"]) => {
  const { portalStatus, openPortalUI, setIsPlayerInside } = useMyStore();

  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Check for player entry
  useFrame(() => {
    if (portalStatus === "ready" && groupRef.current) {
      const portalPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(portalPos);
      const distance = camera.position.distanceTo(portalPos);

      // If player is inside the sphere (radius 1 + buffer)
      if (distance < 1.2) {
        setIsPlayerInside(true);
      }
    }
  });

  // Visual state based on portalStatus
  const getStatusColor = () => {
    switch (portalStatus) {
      case "fetching":
      case "initializing":
        return "#3b82f6"; // Blue-500
      case "ready":
        return "#22c55e"; // Green-500
      case "error":
        return "#ef4444"; // Red-500
      case "idle":
      default:
        return "#ffffff"; // White
    }
  };

  const getStatusText = () => {
    switch (portalStatus) {
      case "fetching":
        return "FETCHING...";
      case "initializing":
        return "INITIALIZING...";
      case "ready":
        return "ENTER WORLD";
      case "error":
        return "ERROR";
      case "idle":
      default:
        return "OPEN PORTAL";
    }
  };

  // Cursor handling
  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from passing through
    openPortalUI();
  };

  return (
    <group {...props} ref={groupRef}>
      {/* Floating Status Text */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {getStatusText()}
      </Text>

      {/* The Portal Sphere */}
      <Sphere
        args={[1, 8, 8]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={getStatusColor()}
          emissive={getStatusColor()}
          emissiveIntensity={hovered ? 0.8 : 0.5}
          roughness={0.2}
          metalness={0.8}
          wireframe={portalStatus === "idle" || portalStatus === "fetching"}
        />
      </Sphere>

      {/* Optional: Add a subtle point light to make it glow */}
      <pointLight
        color={getStatusColor()}
        intensity={2}
        distance={5}
        decay={2}
      />
    </group>
  );
};
