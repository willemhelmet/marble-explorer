import { useEffect, useRef, useState } from "react";
import { Billboard, Sphere, Text } from "@react-three/drei";
import { useMyStore } from "../store/store";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { characterStatus } from "bvhecctrl";
import { type Portal as PortalType } from "../store/worldSlice";
import {
  fetchWorldAssets,
  extractWorldIdFromUrl,
} from "../services/apiService";

export const Portal = ({ portal }: { portal: PortalType }) => {
  const openPortalUI = useMyStore((state) => state.openPortalUI);
  const setGlobalHover = useMyStore((state) => state.setIsHovered);
  const currentWorldId = useMyStore((state) => state.currentWorldId);
  const setEditingPortal = useMyStore((state) => state.setEditingPortal);
  const switchWorld = useMyStore((state) => state.switchWorld);
  const setAssets = useMyStore((state) => state.setAssets);
  const apiKey = useMyStore((state) => state.apiKey);
  //const worldAnchorPosition = useMyStore((state) => state.worldAnchorPosition);
  const setWorldAnchorPosition = useMyStore(
    (state) => state.setWorldAnchorPosition,
  );
  const setWorldAnchorOrientation = useMyStore(
    (state) => state.setWorldAnchorOrientation,
  );
  const updatePortal = useMyStore((state) => state.updatePortal);

  const [isHovered, setIsHovered] = useState(false);
  const isTransitioning = useRef(false);
  const groupRef = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);

  // Sync global hover for crosshair
  useEffect(() => {
    if (isHovered) setGlobalHover(true);
    else setGlobalHover(false);
  }, [isHovered, setGlobalHover]);

  const handleNavigation = async () => {
    if (!portal.url || isTransitioning.current) return;
    isTransitioning.current = true;

    try {
      if (portal.url === "hub") {
        // Returning to the initial lobby
        setWorldAnchorPosition(new THREE.Vector3(0, 0, 0));
        setWorldAnchorOrientation(new THREE.Euler(0, 0, 0));
        setAssets(null);
        switchWorld("hub");
      } else {
        // Traveling to a dynamic world
        const targetWorldId = extractWorldIdFromUrl(portal.url);
        if (targetWorldId) {
          // 1. Fetch assets FIRST before switching worlds
          const assets = await fetchWorldAssets(portal.url, apiKey);

          // 2. Atomic update of world state
          // We anchor the new world to the player's EXACT absolute position
          // so that the player is at (0,0,0) local in the next world.
          const newAnchor = characterStatus.position.clone();

          setWorldAnchorPosition(newAnchor);
          
          // Set the world anchor orientation to the stored rotationY from the server.
          // This ensures a consistent "North" for everyone entering this world.
          // We add Math.PI to align forward vectors (legacy correction).
          const newOrientation = new THREE.Euler(0, 0, 0, "YXZ");
          newOrientation.y = (portal.rotationY || 0) + Math.PI;
          
          setWorldAnchorOrientation(newOrientation);
          setAssets(assets);
          switchWorld(targetWorldId);
        }
      }
    } catch (err) {
      console.error("Portal navigation error:", err);
      // Update this specific portal's status to error so the user knows
      const editingWorldId = currentWorldId; // The world where the portal exists
      updatePortal(editingWorldId, portal.id, { status: "error" });
      isTransitioning.current = false; // Allow retry if it failed
      return;
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

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation(); // Prevent click from passing through
    setEditingPortal(currentWorldId, portal.id);
    openPortalUI();
  };

  return (
    <group position={portal.position} ref={groupRef}>
      {/* Floating Status Text */}
      <Billboard>
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
      </Billboard>

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
