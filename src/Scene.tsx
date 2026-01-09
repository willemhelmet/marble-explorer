import { useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { Player } from "./components/Player.tsx";
import { FloorCollider } from "./components/FloorCollider.tsx";
import { useMyStore } from "./store/store.ts";
import { characterStatus } from "bvhecctrl";
import { Crosshair } from "./components/ui/Crosshair.tsx";
import { WorldContent } from "./WorldContent.tsx";

export const Scene = () => {
  // Atomic selectors to prevent unnecessary re-renders of the whole Scene
  const status = useMyStore((state) => state.status);
  const isHovered = useMyStore((state) => state.isHovered);
  const worldAnchorPos = useMyStore((state) => state.worldAnchorPosition);
  const assets = useMyStore((state) => state.assets);
  const currentWorldId = useMyStore((state) => state.currentWorldId);
  const worldRegistry = useMyStore((state) => state.worldRegistry);

  const addPortal = useMyStore((state) => state.addPortal);
  const openPortalUI = useMyStore((state) => state.openPortalUI);
  const setEditingPortal = useMyStore((state) => state.setEditingPortal);

  useEffect(() => {
    console.log("Scene (Root) re-rendered. Status:", status);
  });

  const [subscribeKeys] = useKeyboardControls();

  useEffect(() => {
    return subscribeKeys(
      (state) => state.create_portal,
      (pressed) => {
        if (pressed && status === "playing") {
          const newPortal = {
            id: `portal-${Date.now()}`,
            position: characterStatus.position.clone(),
            url: null,
            status: "idle" as const,
          };
          addPortal(currentWorldId, newPortal);
          setEditingPortal(currentWorldId, newPortal.id);
          openPortalUI();
          console.log("Portal spawned at", characterStatus.position);
        }
      },
    );
  }, [
    subscribeKeys,
    status,
    currentWorldId,
    addPortal,
    setEditingPortal,
    openPortalUI,
  ]);

  return (
    <>
      <ambientLight intensity={10} />
      <directionalLight intensity={10} position={[1, 1, 1]} />

      <color attach="background" args={[0, 0, 0]} />

      {/* 
          Stable World Content: 
          Memoized to ignore status/isHovered changes 
      */}
      <WorldContent
        currentWorldId={currentWorldId}
        assets={assets}
        worldAnchorPos={worldAnchorPos}
        worldRegistry={worldRegistry}
      />

      {/* Global Physics/Environment */}
      {currentWorldId === "hub" && <FloorCollider />}

      <Player />
      <axesHelper />
      <Crosshair visible={status === "playing" && isHovered} />
    </>
  );
};
