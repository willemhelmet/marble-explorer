import { useMyStore } from "../../store/store";
import { useGLTF, Bvh } from "@react-three/drei";
import { StaticCollider } from "bvhecctrl";
import { useEffect, useMemo } from "react";
import { type ThreeElements } from "@react-three/fiber";

const LoadedCollider = ({
  url,
  ...props
}: { url: string } & ThreeElements["group"]) => {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);

  useEffect(() => {
    return () => {
      // Clear the asset from the cache when unmounting or changing URL
      useGLTF.clear(url);
    };
  }, [url]);

  return (
    <group {...props}>
      <StaticCollider key={url}>
        <Bvh firstHitOnly>
          <primitive object={clonedScene} visible={false} />
        </Bvh>
      </StaticCollider>
    </group>
  );
};

export const WorldCollider = (props: ThreeElements["group"]) => {
  const assets = useMyStore((state) => state.assets);

  if (!assets?.meshUrl) return null;

  return <LoadedCollider url={assets.meshUrl} {...props} />;
};
