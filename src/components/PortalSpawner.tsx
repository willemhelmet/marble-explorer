import { useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useMyStore } from "../store/store";

export const PortalSpawner = () => {
  const status = useMyStore((state) => state.status);
  const openPortalUI = useMyStore((state) => state.openPortalUI);

  const [subscribeKeys] = useKeyboardControls();

  useEffect(() => {
    return subscribeKeys(
      (state) => state.create_portal,
      (pressed) => {
        if (pressed && status === "playing") {
          openPortalUI();
        }
      },
    );
  }, [
    subscribeKeys,
    status,
    openPortalUI,
  ]);

  return null;
};
