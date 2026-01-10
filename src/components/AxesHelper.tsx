import { Billboard, Text } from "@react-three/drei";
import { Vector3 } from "three";

interface AxesHelperProps {
  label?: string;
  position?: Vector3;
  scale?: [number, number, number];
}
export const AxesHelper = ({
  label = "",
  position = new Vector3(0, 0, 0),
  scale = [1, 1, 1],
}: AxesHelperProps) => {
  return (
    <group position={position}>
      <Billboard position={[0, scale[1], 0]}>
        <Text>{label}</Text>
      </Billboard>
      <axesHelper scale={scale} />
    </group>
  );
};
