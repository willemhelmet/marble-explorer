import { type ThreeElements } from "@react-three/fiber";
import { Splat } from "./Splat";
import { useEffect } from "react";
import { WorldCollider } from "./WorldCollider";

export const World = (props: ThreeElements["group"]) => {
  useEffect(() => {
    console.log("World mounted");
    return () => console.log("World unmounted");
  }, []);

  return (
    <group {...props}>
      <Splat />
      <WorldCollider />
    </group>
  );
};
