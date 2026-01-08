import { useEffect, useRef, useState } from "react";
import { Sphere, Text } from "@react-three/drei";
import { useMyStore } from "../store/store";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { type Portal as PortalType } from "../store/worldSlice";
import {
  fetchWorldAssets,
  extractWorldIdFromUrl,
} from "../services/apiService";

export const Portal = ({ portal }: { portal: PortalType }) => {
  const {
    openPortalUI,
    setIsPlayerInside,
    setIsHovered: setGlobalHover,
    currentWorldId,
    setEditingPortal,
    switchWorld,
    setAssets,
  } = useMyStore();

  const [isHovered, setIsHovered] = useState(false);
  const isTransitioning = useRef(false);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Sync global hover for crosshair
  useEffect(() => {
    if (isHovered) setGlobalHover(true);
    else setGlobalHover(false);
  }, [isHovered, setGlobalHover]);

  const handleNavigation = async () => {
    if (!portal.url) return;

    if (portal.url === "hub") {
      // Returning to the initial lobby
      switchWorld("hub");
      setIsPlayerInside(false);
      setAssets(null);
    } else {
      // Traveling to a dynamic world
      const targetWorldId = extractWorldIdFromUrl(portal.url);
      if (targetWorldId) {
        switchWorld(targetWorldId);
        setIsPlayerInside(true);

        // Ensure assets are loaded for this specific destination
        try {
          const assets = await fetchWorldAssets(portal.url);
          setAssets(assets);
        } catch (err) {
          console.error("Auto-navigation fetch error:", err);
        }
      }
    }

    // Guard against immediate re-trigger
    setTimeout(() => {
      isTransitioning.current = false;
    }, 1500);
  };

  // Check for player entry
  useFrame(() => {
    if (isTransitioning.current) return;

    if (portal.status === "ready" && portal.url && groupRef.current) {
      const portalPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(portalPos);
      const distance = camera.position.distanceTo(portalPos);

      // If player is inside the sphere (radius 1 + buffer)
      if (distance < 1.2) {
        isTransitioning.current = true;
        handleNavigation();
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
