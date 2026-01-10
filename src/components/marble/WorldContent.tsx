import { useMemo, memo } from "react";
import { useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { SparkRenderer } from "./SparkRenderer";
import { Splat } from "./Splat";
//import { WorldCollider } from "./WorldCollider";
import { Portal } from "../Portal";
import { Vector3 } from "three";
import type { WorldAssets } from "../../store/portalSlice";
import type { World as WorldData } from "../../store/worldSlice";
// import { AxesHelper } from "../AxesHelper";

interface WorldContentProps {
  currentWorldId: string;
  assets: WorldAssets | null;
  worldAnchorPos: Vector3;
  currentWorld: WorldData | undefined;
}

/**
 * WorldContent renders the geometry, physics colliders, and portals
 * for the currently active world (Hub or Dynamic World).
 *
 * It is memoized to prevent expensive Splat re-renders when
 * high-frequency state (like status or isHovered) updates in the parent.
 */
export const WorldContent = memo(
  ({
    currentWorldId,
    assets,
    worldAnchorPos,
    currentWorld,
  }: WorldContentProps) => {
    const renderer = useThree((state) => state.gl);
    const isHub = currentWorldId === "hub";

    const sparkRendererArgs = useMemo(() => {
      return { renderer, maxStdDev: Math.sqrt(5) };
    }, [renderer]);

    return (
      <group position={worldAnchorPos}>
        {/* <AxesHelper label="splat" scale={[2.5, 2.5, 2.5]} /> */}
        {/* Portals */}
        {currentWorld?.portals.map((portal) => (
          <Portal key={portal.id} portal={portal} />
        ))}

        {/* Geometry & Physics */}
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
            <SparkRenderer args={[sparkRendererArgs]}>
              <Splat rotation={[Math.PI, 0, 0]} scale={[2, 2, 2]} />
            </SparkRenderer>
            /* <WorldCollider /> */
          )
        )}
      </group>
    );
  },
);
