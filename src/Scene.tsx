import { Player } from "./components/Player.tsx";
import { FloorCollider } from "./components/FloorCollider.tsx";
import { useMyStore } from "./store/store.ts";
import { Crosshair } from "./components/ui/Crosshair.tsx";
import { WorldContent } from "./components/marble/WorldContent.tsx";
import { PortalSpawner } from "./components/PortalSpawner.tsx";
import { RemotePlayerManager } from "./components/RemotePlayerManager.tsx";

export const Scene = () => {
  // Only subscribe to world-changing state
  const worldAnchorPosition = useMyStore((state) => state.worldAnchorPosition);
  const worldAnchorRotation = useMyStore(
    (state) => state.worldAnchorOrientation,
  );
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
        worldAnchorPos={worldAnchorPosition}
        worldAnchorRot={worldAnchorRotation}
        currentWorld={currentWorld}
      />

      <FloorCollider />

      <Player />
      <Crosshair />

      <RemotePlayerManager />

      <PortalSpawner />
    </>
  );
};
