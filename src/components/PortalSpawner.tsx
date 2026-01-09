import { useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useMyStore } from "../store/store";
import { characterStatus } from "bvhecctrl";

export const PortalSpawner = () => {
  const status = useMyStore((state) => state.status);
  const currentWorldId = useMyStore((state) => state.currentWorldId);
  const worldAnchorPosition = useMyStore((state) => state.worldAnchorPosition);
  const addPortal = useMyStore((state) => state.addPortal);
  const setEditingPortal = useMyStore((state) => state.setEditingPortal);
  const openPortalUI = useMyStore((state) => state.openPortalUI);

  const [subscribeKeys] = useKeyboardControls();

  useEffect(() => {
    return subscribeKeys(
      (state) => state.create_portal,
      (pressed) => {
        if (pressed && status === "playing") {
          const newPortal = {
            id: `portal-${Date.now()}`,
            position: characterStatus.position.clone().sub(worldAnchorPosition),
            url: null,
            status: "idle" as const,
          };
          addPortal(currentWorldId, newPortal);
          setEditingPortal(currentWorldId, newPortal.id);
          openPortalUI();
        }
      },
    );
  }, [
    subscribeKeys,
    status,
    currentWorldId,
    worldAnchorPosition,
    addPortal,
    setEditingPortal,
    openPortalUI,
  ]);

  return null;
};
