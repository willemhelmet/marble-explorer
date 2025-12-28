import { useMyStore } from "../store/store";
import { useGLTF } from "@react-three/drei";
import { StaticCollider } from "bvhecctrl";
import { useEffect } from "react";

const LoadedCollider = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);

  useEffect(() => {
    return () => {
      // Clear the asset from the cache when unmounting or changing URL
      useGLTF.clear(url);
    };
  }, [url]);

  return (
    <StaticCollider>
      <primitive object={scene} />
    </StaticCollider>
  );
};

export const WorldCollider = () => {
  const assets = useMyStore((state) => state.assets);

  if (!assets?.meshUrl) return null;

  return <LoadedCollider url={assets.meshUrl} />;
};
