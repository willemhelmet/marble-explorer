import { useState } from "react";
import { useMyStore } from "../store/store";
import { fetchWorldAssets } from "../services/apiService";
import { characterStatus } from "bvhecctrl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Vector3, Quaternion, Euler } from "three";
import type { RemixEntry } from "../store/remixSlice";

export const useSplatTransition = () => {
  const setRemixTransition = useMyStore((state) => state.setRemixTransition);
  const finalizeRemixTransition = useMyStore(
    (state) => state.finalizeRemixTransition,
  );
  const setAssets = useMyStore((state) => state.setAssets);
  const setSkipNextReveal = useMyStore((state) => state.setSkipNextReveal);
  const [loadingRemixId, setLoadingRemixId] = useState<string | null>(null);

  const { contextSafe } = useGSAP();

  const startTransition = contextSafe(
    async (remix: RemixEntry, onReady?: () => void) => {
      const state = useMyStore.getState();
      const currentAssets = state.assets;
      if (!currentAssets) return;

      // Avoid transitioning to the same world
      if (!remix.remoteId) return;

      setLoadingRemixId(remix.id);

      try {
        // Fetch world assets for the remix
        const { assets: newAssets } = await fetchWorldAssets(remix.remoteId);

        // Pre-fetch splat binary to warm browser cache
        await fetch(newAssets.splatUrl);

        // Convert player global position to world-local space
        let origin: [number, number, number] = [0, 0, 0];
        try {
          if (characterStatus?.position) {
            const worldAnchorPos = state.worldAnchorPosition;
            const worldAnchorRot = state.worldAnchorOrientation;

            const globalPos = new Vector3(
              characterStatus.position.x,
              characterStatus.position.y,
              characterStatus.position.z,
            );

            // Transform to local space
            const localPos = globalPos.clone().sub(worldAnchorPos);
            const worldQuat = new Quaternion().setFromEuler(
              new Euler(
                worldAnchorRot.x,
                worldAnchorRot.y,
                worldAnchorRot.z,
                "XYZ",
              ),
            );
            worldQuat.invert();
            localPos.applyQuaternion(worldQuat);

            origin = [localPos.x, localPos.y, localPos.z];
          }
        } catch (e) {
          console.warn(
            "Could not get character position for transition origin",
            e,
          );
        }

        // Signal that the asset is cached and panel can close
        onReady?.();
        setLoadingRemixId(null);

        // Start transition
        setRemixTransition({
          isActive: true,
          progress: 0,
          origin,
          currentSplatUrl: currentAssets.splatUrl,
          nextSplatUrl: newAssets.splatUrl,
        });

        // Animate transition
        const transitionObj = { progress: 0 };
        gsap.to(transitionObj, {
          progress: 1,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            setRemixTransition({ progress: transitionObj.progress });
          },
          onComplete: () => {
            // Swap assets in WorldSlice
            setAssets(newAssets);
            setSkipNextReveal(true);
            finalizeRemixTransition();
          },
        });
      } catch (error) {
        console.error("Transition failed:", error);
        setLoadingRemixId(null);
      }
    },
  );

  return { startTransition, loadingRemixId };
};
