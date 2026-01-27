import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Sphere } from "@react-three/drei";
import { useMyStore } from "../store/store";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { characterStatus } from "bvhecctrl";
import { SplatMesh, constructSpherePoints, dyno } from "@sparkjsdev/spark";
import { PortalNoiseDyno } from "../dynos/portalNoiseDyno";
import { type Portal as PortalType } from "../store/worldSlice";
import {
  fetchWorldAssets,
  extractWorldIdFromUrl,
  getOperation,
  type World,
} from "../services/apiService";
import { socketManager } from "../services/socketManager";

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const Portal = ({ portal }: { portal: PortalType }) => {
  const openPortalUI = useMyStore((state) => state.openPortalUI);
  const setGlobalHover = useMyStore((state) => state.setIsHovered);
  const currentWorldId = useMyStore((state) => state.currentWorldId);
  const setEditingPortal = useMyStore((state) => state.setEditingPortal);
  const switchWorld = useMyStore((state) => state.switchWorld);
  const setAssets = useMyStore((state) => state.setAssets);
  const apiKey = useMyStore((state) => state.apiKey);
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

  // --- Visual state based on portal.status ---
  const getStatusColor = useCallback((): [number, number, number] => {
    switch (portal.status) {
      case "fetching":
      case "initializing":
      case "generating":
        return [0.23, 0.51, 0.96]; // Blue-500
      case "ready":
        return [0.13, 0.77, 0.37]; // Green-500
      case "error":
        return [0.94, 0.27, 0.27]; // Red-500
      case "idle":
      default:
        return [1, 1, 1]; // White
    }
  }, [portal.status]);

  // --- Procedural Splat Setup ---
  // Using useMemo for stable dyno objects
  const statusColor = useMemo(() => dyno.dynoVec3([1, 1, 1]), []);
  const uTime = useMemo(() => dyno.dynoFloat(0), []);
  const uHover = useMemo(() => dyno.dynoFloat(0), []);
  const uCameraPos = useMemo(() => dyno.dynoVec3([0, 0, 0]), []);
  const uPortalPos = useMemo(() => dyno.dynoVec3([0, 0, 0]), []);

  useEffect(() => {
    const [r, g, b] = getStatusColor();
    // eslint-disable-next-line react-hooks/immutability
    statusColor.value[0] = r;

    statusColor.value[1] = g;

    statusColor.value[2] = b;

    if (isHovered) {
      // Lighten/Highlight on hover
      statusColor.value[0] *= 1.2;
      statusColor.value[1] *= 1.2;
      statusColor.value[2] *= 1.2;
    }
  }, [getStatusColor, isHovered, statusColor]);

  useEffect(() => {
    gsap.to(uHover, {
      value: isHovered ? 1.0 : 0.0,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [isHovered, uHover]);

  const splatMesh = useMemo(() => {
    const mesh = new SplatMesh({
      constructSplats: (splats) =>
        constructSpherePoints({
          splats,
          maxDepth: 4,
          pointRadius: 0.03,
          pointThickness: 0.01,
        }),
      worldModifier: dyno.dynoBlock(
        { gsplat: dyno.Gsplat }, // input
        { gsplat: dyno.Gsplat }, // output
        ({ gsplat }) => ({
          gsplat: PortalNoiseDyno.apply({
            gsplat,
            color: statusColor,
            uTime: uTime,
            uHover: uHover,
            uCameraPos: uCameraPos,
            uPortalPos: uPortalPos,
          }).gsplat,
        }),
      ),
      onFrame: ({ mesh, time }) => {
        // eslint-disable-next-line react-hooks/immutability
        uTime.value = time;

        // Use getWorldPosition to get absolute world coordinates
        const tempVec = new THREE.Vector3();
        
        camera.getWorldPosition(tempVec);
        uCameraPos.value[0] = tempVec.x;
        uCameraPos.value[1] = tempVec.y;
        uCameraPos.value[2] = tempVec.z;

        if (groupRef.current) {
          groupRef.current.getWorldPosition(tempVec);
          uPortalPos.value[0] = tempVec.x;
          uPortalPos.value[1] = tempVec.y;
          uPortalPos.value[2] = tempVec.z;
        }

        mesh.updateVersion();
      },
    });
    return mesh;
  }, [statusColor, uTime, uHover, uCameraPos, uPortalPos, camera]);

  // --- Distributed Polling Logic ---
  useEffect(() => {
    if (portal.status !== "generating" || !portal.pendingOperationId) return;

    const intervalId = setInterval(async () => {
      // 1. Determine if I am the Designated Poller
      const myId = socketManager.getSocketId();
      if (!myId) return;

      // Access fresh player list directly to avoid resetting the timer on joins/leaves
      const currentRemotePlayers = useMyStore.getState().remotePlayers;
      const allPlayerIds = [
        myId,
        ...Array.from(currentRemotePlayers.keys()),
      ].sort();
      const pollerIndex = hashString(portal.id) % allPlayerIds.length;

      if (allPlayerIds[pollerIndex] !== myId) {
        // I am not the poller for this specific portal
        return;
      }

      try {
        const op = await getOperation<World>(
          portal.pendingOperationId!,
          apiKey,
        );
        if (op.done) {
          if (op.error) {
            socketManager.updatePortal(currentWorldId, portal.id, {
              status: "error",
            });
          } else if (op.response?.world_marble_url) {
            // Fix URL: worlds -> world
            let correctedUrl = op.response.world_marble_url;
            if (correctedUrl.includes("/worlds/")) {
              correctedUrl = correctedUrl.replace("/worlds/", "/world/");
            }

            socketManager.updatePortal(currentWorldId, portal.id, {
              status: "ready",
              url: correctedUrl,
              pendingOperationId: undefined, // Clear operation ID
            });
          }
        }
      } catch (err) {
        console.error("Polling error for portal", portal.id, err);
      }
    }, 15000); // 15 seconds frequency

    return () => clearInterval(intervalId);
  }, [
    portal.status,
    portal.id,
    portal.pendingOperationId,
    // remotePlayers is intentionally omitted to prevent interval reset
    currentWorldId,
    apiKey,
  ]);

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
        setWorldAnchorPosition(new THREE.Vector3(0, 1, 0));
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
      
      const camPos = new THREE.Vector3();
      camera.getWorldPosition(camPos);
      
      const distance = camPos.distanceTo(portalPos);

      // If player is inside the sphere (radius 1 + buffer)
      if (distance < 1.2) {
        handleNavigation();
        setIsHovered(false);
      }
    }
  });

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
      {/* The Procedural Splat */}
      <primitive object={splatMesh} />

      {/* The Interaction Proxy Sphere */}
      <Sphere
        args={[1, 8, 8]}
        visible={false}
        onClick={handleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      />
    </group>
  );
};
