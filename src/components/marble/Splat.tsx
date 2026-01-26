import { useEffect, useMemo, useRef } from "react";
import { SplatMesh } from "@sparkjsdev/spark";
import { useMyStore } from "../../store/store";
import { type ThreeElements, useFrame } from "@react-three/fiber";
import { RevealDyno } from "../../dynos/revealDyno";
import { characterStatus } from "bvhecctrl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const Splat = (props: Partial<ThreeElements["primitive"]>) => {
  const assets = useMyStore((state) => state.assets);
  const splatUrl = assets?.splatUrl;

  const revealRef = useRef({ progress: 0 });

  // 1. Use useMemo to create the mesh synchronously
  // The mesh is now ready on the very first render.
  const splat = useMemo(() => {
    if (!splatUrl) return null;
    return new SplatMesh({
      url: splatUrl,
      dynos: [RevealDyno],
    });
  }, [splatUrl]);

  useGSAP(() => {
    if (splat) {
      revealRef.current.progress = 0;
      RevealDyno.setUniform("revealProgress", 0);

      gsap.to(revealRef.current, {
        progress: 1,
        duration: 2.0,
        ease: "power2.out",
        onUpdate: () => {
          RevealDyno.setUniform("revealProgress", revealRef.current.progress);
        },
      });
    }
  }, [splat]);

  useFrame(() => {
    if (splat) {
      RevealDyno.setUniform("origin", characterStatus.position);
    }
  });

  // 2. Important: Cleanup memory when the component unmounts or url changes
  useEffect(() => {
    return () => {
      // Assuming SplatMesh has a dispose method (most Three.js objects do))
      splat?.dispose();
    };
  }, [splat]);

  if (!splat) return null;

  return (
    <>
      <primitive object={splat} {...props} />
    </>
  );
};
