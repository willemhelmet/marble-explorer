import { type ThreeElements } from "@react-three/fiber";
import { Splat } from "./Splat";

export const World = (props: ThreeElements["group"]) => {
  return (
    <group {...props}>
      <Splat />
    </group>
  );
};
