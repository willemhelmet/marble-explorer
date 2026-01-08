import { useEffect, useRef, useState } from "react";
import { Sphere, Text } from "@react-three/drei";
import { useMyStore } from "../store/store";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { type Portal as PortalType } from "../store/worldSlice";

export const Portal = ({ portal }: { portal: PortalType }) => {
  const {
    openPortalUI,
    setIsPlayerInside,
    setIsHovered: setGlobalHover,
    currentWorldId,
    setEditingPortal,
  } = useMyStore();

  const [isHovered, setIsHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Sync global hover for crosshair
  useEffect(() => {
    if (isHovered) setGlobalHover(true);
    else setGlobalHover(false);
  }, [isHovered, setGlobalHover]);

  // Check for player entry
  useFrame(() => {
    if (portal.status === "ready" && groupRef.current) {
      const portalPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(portalPos);
      const distance = camera.position.distanceTo(portalPos);

      // If player is inside the sphere (radius 1 + buffer)
      if (distance < 1.2) {
        setIsPlayerInside(true);
        setIsHovered(false);
      }
    }
  });

  // Visual state based on portal.status
  const getStatusColor = () => {
    switch (portal.status) {
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
    switch (portal.status) {
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
        return portal.url ? "OPEN PORTAL" : "EMPTY PORTAL";
    }
  };

  // Cursor handling
  useEffect(() => {
    document.body.style.cursor = isHovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [isHovered]);

  const handleClick = (e: any) => {
    e.stopPropagation(); // Prevent click from passing through
    setEditingPortal(currentWorldId, portal.id);
    openPortalUI();
  };

  return (
    <group position={portal.position} ref={groupRef}>
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
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <meshStandardMaterial
          color={getStatusColor()}
          emissive={getStatusColor()}
          emissiveIntensity={isHovered ? 0.8 : 0.5}
          roughness={0.2}
          metalness={0.8}
          wireframe={portal.url === null || portal.status === "fetching"}
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
