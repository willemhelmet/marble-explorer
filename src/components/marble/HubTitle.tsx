import { useEffect, useMemo } from "react";
import { textSplats } from "@sparkjsdev/spark";
import { type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
// import { useControls } from "leva";

export const HubTitle = (props: Partial<ThreeElements["primitive"]>) => {
  // const { position, rotation } = useControls({
  //   position: {
  //     x: 0,
  //     y: 0,
  //     z: 0,
  //   },
  //   rotation: {
  //     x: 0,
  //     y: 0,
  //     z: 0,
  //   },
  // });

  const splat = useMemo(() => {
    return textSplats({
      text: "Marble Explorer",
      color: new THREE.Color(1, 1, 1),
      rgb: new THREE.Color(1, 1, 1),
      fontSize: 64,
      textAlign: "center",
    });
  }, []);

  useEffect(() => {
    return () => {
      splat.dispose();
    };
  }, [splat]);

  if (!splat) return null;

  return (
    <primitive
      object={splat}
      position={[-5.964, 1.747, 1.454]}
      rotation={[0, Math.PI * 0.588, 0]}
      scale={[0.05, 0.05, 0.05]}
      {...props}
    />
  );
};
/*
 * {"position":{"x":-5.964,"y":1.747,"z":1.454}}
 */
