import { useEffect, useMemo } from "react";
import { SplatMesh } from "@sparkjsdev/spark";
import { useMyStore } from "../store/store";

export const Splat = () => {
  const assets = useMyStore((state) => state.assets);

  // 1. Use useMemo to create the mesh synchronously
  // The mesh is now ready on the very first render.
  const splat = useMemo(() => {
    if (!assets?.splatUrl) return null;

    return new SplatMesh({
      url: assets.splatUrl,
    });
  }, [assets?.splatUrl]);
  // 2. Important: Cleanup memory when the component unmounts or url changes
  useEffect(() => {
    return () => {
      // Assuming SplatMesh has a dispose method (most Three.js objects do)
      splat?.dispose();
    };
  }, [splat]);

  if (!splat) return null;

  return <primitive rotation={[Math.PI, 0, 0]} object={splat} />;
};

