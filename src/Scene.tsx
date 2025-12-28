import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { SparkRenderer } from "./SparkRenderer.ts";
import { Player } from "./components/Player.tsx";
import { Splat } from "./components/Splat.tsx";
import { FloorCollider } from "./components/FloorCollider.tsx";
import { Portal } from "./components/Portal.tsx";
import { WorldCollider } from "./components/WorldCollider.tsx";
import { useMyStore } from "./store/store.ts";

export const Scene = () => {
  const renderer = useThree((state) => state.gl);
  const isPlayerInside = useMyStore((state) => state.isPlayerInside);

  const sparkRendererArgs = useMemo(() => {
    return { renderer, maxStdDev: Math.sqrt(5) };
  }, [renderer]);

  return (
    <>
      <color attach="background" args={[0, 0, 0]} />

      {/* Lobby Environment */}
      {!isPlayerInside && (
        <>
          <axesHelper />
          <Grid infiniteGrid={true} sectionColor={"#bbb"} cellColor={"#444"} />
          <FloorCollider />
          <Portal position={[0, 1, -3]} />
        </>
      )}

      <Player />

      {/* Loaded World Assets */}
      <SparkRenderer args={[sparkRendererArgs]}>
        <Splat />
      </SparkRenderer>
      <WorldCollider />
    </>
  );
};
