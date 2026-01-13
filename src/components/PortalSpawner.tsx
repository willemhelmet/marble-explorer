import { useEffect, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useButtonStore } from "bvhecctrl";
import { useMyStore } from "../store/store";

export const PortalSpawner = () => {
  const status = useMyStore((state) => state.status);
  const openPortalUI = useMyStore((state) => state.openPortalUI);

  const [subscribeKeys] = useKeyboardControls();

  // Mobile virtual button listener
  const isCreatePressed = useButtonStore(
    (state) => state.buttons["create-portal"],
  );
  const wasCreatePressed = useRef(false);

  useEffect(() => {
    if (isCreatePressed && !wasCreatePressed.current) {
      if (status === "playing") {
        openPortalUI();
      }
    }
    wasCreatePressed.current = isCreatePressed;
  }, [isCreatePressed, status, openPortalUI]);

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
