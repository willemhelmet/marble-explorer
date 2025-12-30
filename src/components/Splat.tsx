import { useEffect, useMemo } from "react";
import { SplatMesh } from "@sparkjsdev/spark";
import { useMyStore } from "../store/store";
import { type ThreeElements } from "@react-three/fiber";

export const Splat = (props: ThreeElements["group"]) => {
  const assets = useMyStore((state) => state.assets);
  const splatUrl = assets?.splatUrl;

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
      // Assuming SplatMesh has a dispose method (most Three.js objects do)
      splat?.dispose();
    };
  }, [splat]);

  if (!splat) return null;

  return (
    <group {...props}>
      <primitive rotation={[Math.PI, 0, 0]} object={splat} />;
    </group>
  );
};
