import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useMyStore } from "../store/store";

export const ControlsManager = () => {
  const controls = useThree((state) => state.controls) as any; // Cast to any because standard OrbitControls might not have lock/unlock types inferred correctly if mixed
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
