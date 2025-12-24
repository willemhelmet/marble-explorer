import { StaticCollider } from "bvhecctrl";

export const FloorCollider = () => {
  return (
    <StaticCollider>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </StaticCollider>
  );
};
