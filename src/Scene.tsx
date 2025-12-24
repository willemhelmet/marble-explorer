import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { SparkRenderer } from "./SparkRenderer.ts";
import { Player } from "./components/Player.tsx";
import { Splat } from "./components/Splat.tsx";
import { FloorCollider } from "./components/FloorCollider.tsx";
import { Portal } from "./components/Portal.tsx";

export const Scene = () => {
  const renderer = useThree((state) => state.gl);
  const sparkRendererArgs = useMemo(() => {
    return { renderer, maxStdDev: Math.sqrt(5) };
  }, [renderer]);
  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <axesHelper />
      <Grid infiniteGrid={true} sectionColor={"#bbb"} cellColor={"#444"} />
      <Player />
      <FloorCollider />
      <SparkRenderer args={[sparkRendererArgs]}>
        <Splat />
      </SparkRenderer>
      <Portal position={[0, 1, -3]} />
    </>
  );
};
