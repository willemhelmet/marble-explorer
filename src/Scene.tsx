import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Grid /*useKeyboardControls*/ } from "@react-three/drei";
import { SparkRenderer } from "./SparkRenderer.ts";
import { Player } from "./components/Player.tsx";
import { FloorCollider } from "./components/FloorCollider.tsx";
import { Portal } from "./components/Portal.tsx";
import { useMyStore } from "./store/store.ts";
// import { characterStatus } from "bvhecctrl";
import { Crosshair } from "./components/ui/Crosshair.tsx";
import { World } from "./components/marble/World.tsx";

export const Scene = () => {
  const renderer = useThree((state) => state.gl);
  const isPlayerInside = useMyStore((state) => state.isPlayerInside);
  const portalPos = useMyStore((state) => state.position);
  // const openPortalUI = useMyStore((state) => state.openPortalUI);
  const status = useMyStore((state) => state.status);
  const isHovered = useMyStore((state) => state.isHovered);

  const sparkRendererArgs = useMemo(() => {
    return { renderer, maxStdDev: Math.sqrt(5) };
  }, [renderer]);

  // useKeyboardControls((key) => {
  //   if (key.create_portal) {
  //     openPortalUI();
  //     console.log(
  //       "TODO: Create a portal at player position: ",
  //       characterStatus.position,
  //     );
  //   }
  // });

  return (
    <>
      <ambientLight intensity={10} />
      <directionalLight intensity={10} position={[1, 1, 1]} />

      <color attach="background" args={[0, 0, 0]} />
      {/* Lobby Environment */}
      {!isPlayerInside && (
        <>
          <axesHelper />
          <Grid infiniteGrid={true} sectionColor={"#bbb"} cellColor={"#444"} />
          <Portal position={portalPos} />
        </>
      )}

      <Player />
      <Crosshair visible={status === "playing" && isHovered} />
      <FloorCollider />

      {/* Loaded World Assets */}
      <SparkRenderer args={[sparkRendererArgs]}>
        {isPlayerInside && (
          <World
            position={portalPos}
            rotation={[Math.PI, 0, 0]}
            scale={[2, 2, 2]}
          />
        )}
      </SparkRenderer>
    </>
  );
};
