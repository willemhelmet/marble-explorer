import { StaticCollider } from "bvhecctrl";
import { Bvh } from "@react-three/drei";
import { useMyStore } from "../store/store";

export const FloorCollider = () => {
  const worldAnchorPosition = useMyStore((state) => state.worldAnchorPosition);
  return (
    <>
      <StaticCollider
        position={[worldAnchorPosition.x, -0.01, worldAnchorPosition.z]}
        key={worldAnchorPosition.toString()}
      >
        <Bvh firstHitOnly>
          <mesh rotation-x={-Math.PI / 2}>
            <planeGeometry args={[1000, 1000, 100, 100]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </Bvh>
      </StaticCollider>
    </>
  );
};
