import { Player } from "./components/Player.tsx";
import { FloorCollider } from "./components/FloorCollider.tsx";
import { useMyStore } from "./store/store.ts";
import { Crosshair } from "./components/ui/Crosshair.tsx";
import { WorldContent } from "./components/marble/WorldContent.tsx";
import { PortalSpawner } from "./components/PortalSpawner.tsx";

export const Scene = () => {
  // Only subscribe to world-changing state
  const worldAnchorPos = useMyStore((state) => state.worldAnchorPosition);
  const assets = useMyStore((state) => state.assets);
  const currentWorldId = useMyStore((state) => state.currentWorldId);
  const currentWorld = useMyStore(
    (state) => state.worldRegistry[state.currentWorldId],
  );

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight intensity={1} position={[1, 1, 1]} />
      <color attach="background" args={[0, 0, 0]} />

      <WorldContent
        currentWorldId={currentWorldId}
        assets={assets}
        worldAnchorPos={worldAnchorPos}
        currentWorld={currentWorld}
      />

      <FloorCollider />

      <Player />
      <Crosshair />

      <axesHelper />

      <PortalSpawner />
    </>
  );
};
