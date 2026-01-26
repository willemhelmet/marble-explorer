import { useEffect, useMemo, useRef, useState } from "react";
import { SplatMesh } from "@sparkjsdev/spark";
import { useMyStore } from "../../store/store";
import { type ThreeElements, useFrame } from "@react-three/fiber";
import { RevealDyno } from "../../dynos/revealDyno";
import { characterStatus } from "bvhecctrl";
import gsap from "gsap";

export const Splat = (props: Partial<ThreeElements["primitive"]>) => {
  const assets = useMyStore((state) => state.assets);
  const splatUrl = assets?.splatUrl;

  const revealRef = useRef({ progress: 0 });
  const [animationStarted, setAnimationStarted] = useState(false);

  // 1. Use useMemo to create the mesh synchronously
  const splat = useMemo(() => {
    if (!splatUrl) return null;
    const mesh = new SplatMesh({
      url: splatUrl,
      dynos: [RevealDyno],
    });
    // Ensure hidden initially
    RevealDyno.setUniform("revealProgress", 0);
    return mesh;
  }, [splatUrl]);

  // Reset animation state when URL changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnimationStarted(false);
    RevealDyno.setUniform("revealProgress", 0);
    revealRef.current.progress = 0;
  }, [splatUrl]);

  useFrame(() => {
    if (splat) {
      RevealDyno.setUniform("origin", characterStatus.position);

      // Check if loaded (numSplats > 0) and animation hasn't started
      // Check if loaded (isInitialized) and animation hasn't started
      if (!animationStarted && (splat as any).isInitialized) {
        console.log("Splat initialized, starting reveal...");
        setAnimationStarted(true);

        revealRef.current.progress = 0;
        gsap.to(revealRef.current, {
          progress: 1,
          duration: 2.0,
          ease: "power2.out",
          onUpdate: () => {
            RevealDyno.setUniform("revealProgress", revealRef.current.progress);
          },
        });
      }
    }
  });

  // 2. Important: Cleanup memory when the component unmounts or url changes
  useEffect(() => {
    return () => {
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