import { StaticCollider } from "bvhecctrl";
import { Bvh } from "@react-three/drei";

export const FloorCollider = () => {
  return (
    <StaticCollider>
      <Bvh firstHitOnly>
        <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </Bvh>
    </StaticCollider>
  );
};
