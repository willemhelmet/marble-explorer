import { Sphere } from "@react-three/drei";
export const Portal = (props) => {
  return (
    <group {...props}>
      <Sphere>
        <meshBasicMaterial color="green" />
      </Sphere>
    </group>
  );
};
