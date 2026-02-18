import { useEffect, useRef, useState } from "react";
import { SplatMesh, dyno } from "@sparkjsdev/spark";
import * as THREE from "three";
import { useMyStore } from "../../store/store";
import { useFrame } from "@react-three/fiber";
import { TransitionDyno } from "../../dynos/transitionDyno";

export const RemixTransition = () => {
  const remixTransition = useMyStore((state) => state.remixTransition);
  const { currentSplatUrl, nextSplatUrl } = remixTransition;

  if (!currentSplatUrl || !nextSplatUrl) return null;

  return (
    <RemixTransitionInner
      key={`${currentSplatUrl}-${nextSplatUrl}`}
      currentSplatUrl={currentSplatUrl}
      nextSplatUrl={nextSplatUrl}
    />
  );
};

const RemixTransitionInner = ({
  currentSplatUrl,
  nextSplatUrl,
}: {
  currentSplatUrl: string;
  nextSplatUrl: string;
}) => {
  const remixTransition = useMyStore((state) => state.remixTransition);

  // Initialize uniforms and meshes in a single stable useState block
  // (same pattern as Splat.tsx to appease the linter)
  const [data] = useState(() => {
    const origin = new dyno.DynoVec3({
      value: new THREE.Vector3(...remixTransition.origin),
    });
    const transitionProgress = new dyno.DynoFloat({ value: 0 });
    const transitionActive = new dyno.DynoFloat({ value: 1.0 });
    const currentMyIndex = new dyno.DynoFloat({ value: 0 });
    const currentHidingIndex = new dyno.DynoFloat({ value: 0 });
    const currentShowingIndex = new dyno.DynoFloat({ value: -1 });
    const nextMyIndex = new dyno.DynoFloat({ value: 1 });
    const nextHidingIndex = new dyno.DynoFloat({ value: -1 });
    const nextShowingIndex = new dyno.DynoFloat({ value: 1 });

    const currentMesh = new SplatMesh({
      url: currentSplatUrl,
      worldModifier: dyno.dynoBlock(
        { gsplat: dyno.Gsplat },
        { gsplat: dyno.Gsplat },
        ({ gsplat }) => ({
          gsplat: TransitionDyno.apply({
            gsplat,
            origin,
            transitionProgress,
            myIndex: currentMyIndex,
            hidingIndex: currentHidingIndex,
            showingIndex: currentShowingIndex,
            transitionActive,
          }).gsplat,
        }),
      ),
    });

    const nextMesh = new SplatMesh({
      url: nextSplatUrl,
      worldModifier: dyno.dynoBlock(
        { gsplat: dyno.Gsplat },
        { gsplat: dyno.Gsplat },
        ({ gsplat }) => ({
          gsplat: TransitionDyno.apply({
            gsplat,
            origin,
            transitionProgress,
            myIndex: nextMyIndex,
            hidingIndex: nextHidingIndex,
            showingIndex: nextShowingIndex,
            transitionActive,
          }).gsplat,
        }),
      ),
    });

    return { transitionProgress, currentMesh, nextMesh };
  });

  const { currentMesh, nextMesh } = data;

  // Use a ref for the progress uniform so useFrame can mutate it
  const progressRef = useRef(data.transitionProgress);

  // Track latest transition state via ref for useFrame
  const transitionStateRef = useRef(remixTransition);
  useEffect(() => {
    transitionStateRef.current = remixTransition;
  }, [remixTransition]);

  useFrame(() => {
    progressRef.current.value = transitionStateRef.current.progress;
    currentMesh.updateVersion();
    nextMesh.updateVersion();
  });

  // Dispose on unmount
  useEffect(() => {
    return () => {
      currentMesh.dispose();
      nextMesh.dispose();
    };
  }, [currentMesh, nextMesh]);

  return (
    <>
      <primitive
        object={currentMesh}
        rotation={[Math.PI, 0, 0]}
        scale={[2, 2, 2]}
      />
      <primitive
        object={nextMesh}
        rotation={[Math.PI, 0, 0]}
        scale={[2, 2, 2]}
      />
    </>
  );
};
