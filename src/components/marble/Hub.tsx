import { useEffect, useMemo, useState } from "react";
import { SplatMesh } from "@sparkjsdev/spark";
import { type ThreeElements } from "@react-three/fiber";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const Hub = (props: Partial<ThreeElements["primitive"]>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Load the local lobby splat
  const splat = useMemo(() => {
    return new SplatMesh({
      url: "/marble-explorer-lobby.spz",
      onLoad: () => setIsLoaded(true),
    });
  }, []);

  // Fade in once loaded
  useGSAP(() => {
    if (isLoaded) {
      const target = { val: 0 };
      gsap.to(target, {
        val: 1,
        duration: 1,
        onUpdate: () => setOpacity(target.val),
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    return () => {
      splat.dispose();
    };
  }, [splat]);

  if (!splat) return null;

  return (
    <primitive 
      object={splat} 
      rotation={[Math.PI, 0, 0]} 
      scale={[2, 2, 2]}
      {...props} 
    />
  );
};
