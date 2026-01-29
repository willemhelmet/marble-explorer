import { useEffect, useMemo } from "react";
import { textSplats } from "@sparkjsdev/spark";
import { type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

export const HubTitle = (props: Partial<ThreeElements["primitive"]>) => {
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
      position={[0, 4, 0]}
      scale={[0.05, 0.05, 0.05]}
      {...props}
    />
  );
};
