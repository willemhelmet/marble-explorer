import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useMyStore } from "../store/store";
import type { PointerLockControls } from "three/examples/jsm/Addons.js";

export const ControlsManager = () => {
  const controls = useThree((state) => state.controls) as PointerLockControls | null;
  const status = useMyStore((state) => state.status);

  useEffect(() => {
    if (!controls) return;

    if (status === "playing") {
      controls.lock?.();
    } else {
      controls.unlock?.();
    }
  }, [status, controls]);

  return null;
};
