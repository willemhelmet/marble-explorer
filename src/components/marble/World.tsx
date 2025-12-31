import { type ThreeElements } from "@react-three/fiber";
import { Splat } from "./Splat";
import { WorldCollider } from "./WorldCollider";

export const World = (props: ThreeElements["group"]) => {
  return (
    <group {...props}>
      <Splat />
      <WorldCollider />
    </group>
  );
};
