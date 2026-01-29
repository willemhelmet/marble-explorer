import { useEffect, useMemo, useState } from "react";
import { textSplats } from "@sparkjsdev/spark";
import { type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

export const HubTitle = (props: Partial<ThreeElements["primitive"]>) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Wait for the custom font to load before rasterizing
    document.fonts.load('64px "Karrik"').then(() => {
      setFontLoaded(true);
    });
  }, []);

  const splat = useMemo(() => {
    if (!fontLoaded) return null;

    return textSplats({
      text: "MARBLE EXPLORER",
      font: '"Karrik", Arial',
      color: new THREE.Color(1, 1, 1),
      rgb: new THREE.Color(1, 1, 1),
      fontSize: 32,
      textAlign: "center",
      dotRadius: 0.5,
    });
  }, [fontLoaded]);

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
