import { StaticCollider } from "bvhecctrl";
import { Bvh } from "@react-three/drei";
import { useMyStore } from "../store/store";

export const FloorCollider = () => {
  const worldAnchorPosition = useMyStore((state) => state.worldAnchorPosition);
  return (
    <>
      <axesHelper
        scale={[1, 5, 1]}
        position={[worldAnchorPosition.x, -0.01, worldAnchorPosition.z]}
      />

      <StaticCollider
        key={`${worldAnchorPosition.x}-${worldAnchorPosition.y}-${worldAnchorPosition.z}`}
      >
        <Bvh firstHitOnly>
          <mesh
            rotation-x={-Math.PI / 2}
            position={[worldAnchorPosition.x, -0.01, worldAnchorPosition.z]}
          >
            <planeGeometry args={[100, 100, 100, 100]} />
            {/* <meshBasicMaterial transparent opacity={0} depthWrite={false} /> */}
            <meshBasicMaterial color="red" wireframe />
          </mesh>
        </Bvh>
      </StaticCollider>
    </>
  );
};
