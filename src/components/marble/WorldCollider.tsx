import { useMyStore } from "../../store/store";
import { useGLTF } from "@react-three/drei";
import { StaticCollider } from "bvhecctrl";
import { useEffect, useMemo } from "react";
import { Mesh, MeshBasicMaterial } from "three";

const LoadedCollider = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    const invisibleMaterial = new MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    clone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        (child as Mesh).material = invisibleMaterial;
      }
    });

    return clone;
  }, [scene]);

  useEffect(() => {
    return () => {
      // Clear the asset from the cache when unmounting or changing URL
      useGLTF.clear(url);
    };
  }, [url]);

  return (
    <StaticCollider>
      <primitive object={clonedScene} />
    </StaticCollider>
  );
};

export const WorldCollider = () => {
  const assets = useMyStore((state) => state.assets);

  if (!assets?.meshUrl) return null;

  return <LoadedCollider url={assets.meshUrl} />;
};
