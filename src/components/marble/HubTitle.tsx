import { useEffect, useMemo, useState } from "react";
import { textSplats, dyno } from "@sparkjsdev/spark";
import { type ThreeElements, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TextFloatingDyno } from "../../dynos/textFloatingDyno";

export const HubTitle = (props: Partial<ThreeElements["primitive"]>) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  // Time uniform for the dyno
  const uTime = useMemo(() => new dyno.DynoFloat({ value: 0 }), []);

  useEffect(() => {
    // Wait for the custom font to load before rasterizing
    document.fonts.load('64px "Karrik"').then(() => {
      setFontLoaded(true);
    });
  }, []);

  const splat = useMemo(() => {
    if (!fontLoaded) return null;

    const mesh = textSplats({
      text: "Marble Explorer",
      font: '"Karrik", Arial',
      color: new THREE.Color(1, 1, 1),
      rgb: new THREE.Color(1, 1, 1),
      fontSize: 64,
      textAlign: "center",
      dotRadius: 0.5,
    });

    return mesh;
  }, [fontLoaded]);

  useEffect(() => {
    if (splat) {
      splat.worldModifier = dyno.dynoBlock(
        { gsplat: dyno.Gsplat },
        { gsplat: dyno.Gsplat },
        ({ gsplat }) => ({
          gsplat: TextFloatingDyno.apply({
            gsplat,
            uTime: uTime,
          }).gsplat,
        }),
      );
    }
  }, [splat, uTime]);

  useFrame((state) => {
    if (splat) {
      uTime.value = state.clock.getElapsedTime();
      // Force update to apply dyno changes
      (splat as any).updateVersion();
    }
  });

  useEffect(() => {
    return () => {
      splat?.dispose();
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
