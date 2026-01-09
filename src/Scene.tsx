import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Grid, useKeyboardControls } from "@react-three/drei";
import { SparkRenderer } from "./SparkRenderer.ts";
import { Player } from "./components/Player.tsx";
import { FloorCollider } from "./components/FloorCollider.tsx";
import { Portal } from "./components/Portal.tsx";
import { useMyStore } from "./store/store.ts";
import { characterStatus } from "bvhecctrl";
import { Crosshair } from "./components/ui/Crosshair.tsx";
import { World } from "./components/marble/World.tsx";

export const Scene = () => {
  const renderer = useThree((state) => state.gl);
  const worldAnchorPos = useMyStore((state) => state.worldAnchorPosition);
  const status = useMyStore((state) => state.status);
  const isHovered = useMyStore((state) => state.isHovered);
  const assets = useMyStore((state) => state.assets);

  const worldRegistry = useMyStore((state) => state.worldRegistry);
  const currentWorldId = useMyStore((state) => state.currentWorldId);
  const addPortal = useMyStore((state) => state.addPortal);
  const openPortalUI = useMyStore((state) => state.openPortalUI);
  const setEditingPortal = useMyStore((state) => state.setEditingPortal);
  const currentWorld = worldRegistry[currentWorldId];

  const isHub = currentWorldId === "hub";

  const [subscribeKeys] = useKeyboardControls();

  useEffect(() => {
    return subscribeKeys(
      (state) => state.create_portal,
      (pressed) => {
        if (pressed && status === "playing") {
          const newPortal = {
            id: `portal-${Date.now()}`,
            position: characterStatus.position.clone(),
            url: null,
            status: "idle" as const,
          };
          addPortal(currentWorldId, newPortal);
          setEditingPortal(currentWorldId, newPortal.id);
          openPortalUI();
          console.log("Portal spawned at", characterStatus.position);
        }
      },
    );
  }, [
    subscribeKeys,
    status,
    currentWorldId,
    addPortal,
    setEditingPortal,
    openPortalUI,
  ]);

  const sparkRendererArgs = useMemo(() => {
    return { renderer, maxStdDev: Math.sqrt(5) };
  }, [renderer]);

  return (
    <>
      <ambientLight intensity={10} />
      <directionalLight intensity={10} position={[1, 1, 1]} />

      <color attach="background" args={[0, 0, 0]} />

      {/* World Container: Parents everything to the current world anchor */}
      <group position={worldAnchorPos}>
        {/* 1. Portals */}
        {currentWorld?.portals.map((portal) => (
          <Portal key={portal.id} portal={portal} />
        ))}

        {/* 2. Geometry & Physics */}
        {isHub ? (
          <>
            <Grid
              position={[0, -1, 0]}
              infiniteGrid={true}
              sectionColor={"#bbb"}
              cellColor={"#444"}
            />
          </>
        ) : (
          assets && (
            <group rotation={[Math.PI, 0, 0]} scale={[2, 2, 2]}>
              <SparkRenderer args={[sparkRendererArgs]}>
                <World />
              </SparkRenderer>
            </group>
          )
        )}
      </group>

      <Player />
      <axesHelper />
      <FloorCollider />

      <Crosshair visible={status === "playing" && isHovered} />
    </>
  );
};
