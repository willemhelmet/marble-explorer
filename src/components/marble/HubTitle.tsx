import { useEffect, useRef, useState } from "react";
import { textSplats, dyno } from "@sparkjsdev/spark";
import { type ThreeElements, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TextFloatingDyno } from "../../dynos/textFloatingDyno";

export const HubTitle = (props: Partial<ThreeElements["primitive"]>) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Wait for the custom font to load before rasterizing
    document.fonts.load('64px "Karrik"').then(() => {
      setFontLoaded(true);
    });
  }, []);

  if (!fontLoaded) return null;

  return <HubTitleInner {...props} />;
};

const HubTitleInner = (props: Partial<ThreeElements["primitive"]>) => {
  const [data] = useState(() => {
    const uTime = new dyno.DynoFloat({ value: 0 });
    const splat = textSplats({
      text: "Marble\nExplorer",
      font: '"Karrik", Arial',
      color: new THREE.Color(1, 1, 1),
      rgb: new THREE.Color(1, 1, 1),
      fontSize: 48,
      textAlign: "right",
      dotRadius: 0.5,
    });

    splat.worldModifier = dyno.dynoBlock(
      { gsplat: dyno.Gsplat },
      { gsplat: dyno.Gsplat },
      ({ gsplat }) => ({
        gsplat: TextFloatingDyno.apply({
          gsplat,
          uTime,
        }).gsplat,
      }),
    );

    return { uTime, splat };
  });

  const { splat } = data;
  const uTimeRef = useRef(data.uTime);

  useFrame((state) => {
    uTimeRef.current.value = state.clock.getElapsedTime();
    // Force update to apply dyno changes
    splat.updateVersion();
  });

  useEffect(() => {
    return () => {
      splat.dispose();
    };
  }, [splat]);

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
