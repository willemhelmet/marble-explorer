import { useEffect, useMemo } from "react";
import { SplatMesh } from "@sparkjsdev/spark";
import { type ThreeElements } from "@react-three/fiber";

export const Hub = (props: Partial<ThreeElements["primitive"]>) => {
  // Load the local lobby splat
  const splat = useMemo(() => {
    return new SplatMesh({
      url: "/lobby.sog",
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
      position={[0, -0.5, 0]}
      rotation={[Math.PI * -0.01, 0, 0]}
      scale={[2, 2, 2]}
      {...props}
    />
  );
};
