import { useMemo, memo } from "react";
import { useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { SparkRenderer } from "./SparkRenderer";
import { World } from "./components/marble/World";
import { WorldCollider } from "./components/marble/WorldCollider";
import { Portal } from "./components/Portal";
import { Vector3 } from "three";
import type { WorldAssets } from "./store/portalSlice";
import type { World as WorldData } from "./store/worldSlice";

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

    console.log("[WorldContent] Rendering world.", {
      currentWorldId,
      worldAnchorPos: worldAnchorPos.toArray(),
      isHub,
      portalCount: currentWorld?.portals.length || 0
    });

    const sparkRendererArgs = useMemo(() => {
      return { renderer, maxStdDev: Math.sqrt(5) };
    }, [renderer]);

    return (
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
              {/* <WorldCollider /> */}
            </group>
          )
        )}
      </group>
    );
  },
);
