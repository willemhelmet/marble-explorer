import { useState } from "react";
import {
  fetchWorldAssets,
  getOperation,
  generateWorldFromImage,
  type World,
} from "../services/apiService";
import {
  generateRemix as geminiRemix,
  generateImage as geminiImage,
} from "../services/nanoBananaService";
import { useMyStore } from "../store/store";
import { socketManager } from "../services/socketManager";

export interface RemixResult {
  worldId: string;
  splatUrl: string;
  panoUrl?: string;
}

export const useRemix = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RemixResult | null>(null);
  const [status, setStatus] = useState<string>("");
  const previewImage = useMyStore((state) => state.remixPreviewImage);
  const setPreviewImage = useMyStore((state) => state.setRemixPreviewImage);

  const preview = async (prompt: string, panoUrl?: string) => {
    setIsLoading(true);
    setError(null);
    setStatus("Generating preview...");
    try {
      let img: string;
      if (panoUrl) {
        // Fetch the pano image and convert to base64
        const response = await fetch(panoUrl);
        if (!response.ok)
          throw new Error(`Failed to fetch pano: ${response.statusText}`);

        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        img = await geminiRemix(prompt, base64, blob.type);
      } else {
        img = await geminiImage(prompt);
      }
      setPreviewImage(img);
      setStatus("");
      return img;
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Preview generation failed";
      setError(message);
      setStatus("");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const generate = async (prompt: string, imageBase64: string) => {
    setIsLoading(true);
    setError(null);
    setStatus("Starting world generation...");
    try {
      // Strip data URI prefix
      const raw = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const operation = await generateWorldFromImage({
        prompt,
        imageBase64: raw,
        displayName: "Remix: " + prompt.substring(0, 30),
        isPano: true,
      });

      setStatus("Generating 3D world (this may take a few minutes)...");

      // Poll operation
      const POLLING_INTERVAL = 5000;
      let opResult = operation;
      while (!opResult.done) {
        await new Promise((r) => setTimeout(r, POLLING_INTERVAL));
        opResult = await getOperation<World>(opResult.operation_id);
      }

      if (opResult.error) {
        throw new Error(`Generation failed: ${opResult.error.message}`);
      }

      if (!opResult.response) {
        throw new Error("Operation completed but no response");
      }

      const worldId =
        (opResult.response as World).id ||
        (opResult.response as { world_id?: string }).world_id;
      if (!worldId) {
        throw new Error("No world ID in response");
      }

      setStatus("Fetching world assets...");

      // Wait for CDN propagation
      await new Promise((r) => setTimeout(r, 2000));

      const { assets } = await fetchWorldAssets(worldId);

      const remixResult: RemixResult = {
        worldId,
        splatUrl: assets.splatUrl,
        panoUrl: assets.panoUrl || undefined,
      };

      setResult(remixResult);
      setStatus("World generated successfully!");

      // Persist to server via socket
      const currentWorldId = useMyStore.getState().currentWorldId;
      socketManager.createRemix(
        currentWorldId,
        worldId,
        "Remix: " + prompt.substring(0, 30),
        prompt,
      );

      return remixResult;
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "World generation failed";
      setError(message);
      setStatus("");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = (base64: string) => {
    setPreviewImage(base64);
  };

  const reset = () => {
    setResult(null);
    setPreviewImage(null);
    setError(null);
    setStatus("");
  };

  return {
    preview,
    generate,
    uploadImage,
    reset,
    previewImage,
    isLoading,
    error,
    result,
    status,
  };
};
