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
import { WorldCollider } from "./components/marble/WorldCollider.tsx";

export const Scene = () => {
  const renderer = useThree((state) => state.gl);
  const isPlayerInside = useMyStore((state) => state.isPlayerInside);
  const worldAnchorPos = useMyStore((state) => state.worldAnchorPosition);
  // const openPortalUI = useMyStore((state) => state.openPortalUI);
  const status = useMyStore((state) => state.status);
  const isHovered = useMyStore((state) => state.isHovered);
  const assets = useMyStore((state) => state.assets);

  const worldRegistry = useMyStore((state) => state.worldRegistry);
  const currentWorldId = useMyStore((state) => state.currentWorldId);
  const addPortal = useMyStore((state) => state.addPortal);
  const currentWorld = worldRegistry[currentWorldId];

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
          console.log("Portal spawned at", characterStatus.position);
        }
      },
    );
  }, [subscribeKeys, status, currentWorldId, addPortal]);

  const sparkRendererArgs = useMemo(() => {
    return { renderer, maxStdDev: Math.sqrt(5) };
  }, [renderer]);

  return (
    <>
      <ambientLight intensity={10} />
      <directionalLight intensity={10} position={[1, 1, 1]} />

      {/*WHP: Doesn't work anymore while BVH is active???*/}
      <color attach="background" args={[0, 0, 0]} />

      {/* Lobby Environment */}
      {!isPlayerInside && (
        <>
          <axesHelper />
          <Grid infiniteGrid={true} sectionColor={"#bbb"} cellColor={"#444"} />
          {currentWorld?.portals.map((portal) => (
            <Portal key={portal.id} portal={portal} />
          ))}
        </>
      )}

      <Player />
      <Crosshair visible={status === "playing" && isHovered} />
      <FloorCollider />

      {/* Loaded World Assets */}
      {assets && isPlayerInside && (
        <group
          position={worldAnchorPos}
          rotation={[Math.PI, 0, 0]}
          scale={[2, 2, 2]}
        >
          <SparkRenderer args={[sparkRendererArgs]}>
            <World />
          </SparkRenderer>
          <WorldCollider />
        </group>
      )}
    </>
  );
};
