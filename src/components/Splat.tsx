import { useEffect, useState } from "react";
import { SplatMesh } from "@sparkjsdev/spark";
import { useMyStore } from "../store/store";

export const Splat = () => {
  const assets = useMyStore((state) => state.assets);
  const [splat, setSplat] = useState<SplatMesh | null>(null);

  useEffect(() => {
    if (!assets?.splatUrl) {
      setSplat(null);
      return;
    }

    const splatMesh = new SplatMesh({
      url: assets.splatUrl,
    });
    setSplat(splatMesh);

    return () => {
      // Basic Three.js cleanup
      splatMesh.geometry.dispose();
      (splatMesh.material as any).dispose();
    };
  }, [assets?.splatUrl]);

  if (!splat) return null;

  return (
    <>
      <primitive object={splat} />
    </>
  );
};
