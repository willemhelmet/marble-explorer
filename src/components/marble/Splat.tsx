import { useEffect, useMemo, useRef } from "react";
import { SplatMesh } from "@sparkjsdev/spark";
import { useMyStore } from "../../store/store";
import * as THREE from "three";

export const Splat = () => {
  const assets = useMyStore((state) => state.assets);
  const splatUrl = assets?.splatUrl;

  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    console.log("Splat mounted");
    return () => console.log("Splat unmounted");
  }, []);

  // 1. Use useMemo to create the mesh synchronously
  // The mesh is now ready on the very first render.
  const splat = useMemo(() => {
    if (!splatUrl) return null;
    return new SplatMesh({
      url: splatUrl,
    });
  }, [splatUrl]);

  // 2. Important: Cleanup memory when the component unmounts or url changes
  useEffect(() => {
    return () => {
      // Assuming SplatMesh has a dispose method (most Three.js objects do))
      splat?.dispose();
    };
  }, [splat]);

  if (!splat) return null;

  return (
    <group ref={ref}>
      <primitive object={splat} />
    </group>
  );
};
