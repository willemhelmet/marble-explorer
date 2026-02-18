import { useState, useEffect, useRef } from "react";
import { useMyStore } from "../../../store/store";
import { useRemix } from "../../../hooks/useRemix";
import { useSplatTransition } from "../../../hooks/useSplatTransition";
import { fetchWorldThumbnail } from "../../../services/apiService";
import type { RemixEntry } from "../../../store/remixSlice";

interface RemixTabProps {
  onCancel: () => void;
}

export const RemixTab = ({ onCancel }: RemixTabProps) => {
  const remixes = useMyStore((state) => state.remixes);
  const setRemixThumbnail = useMyStore((state) => state.setRemixThumbnail);
  const assets = useMyStore((state) => state.assets);
  const currentWorldId = useMyStore((state) => state.currentWorldId);
  const isHub = currentWorldId === "hub";

  const {
    preview,
    generate,
    uploadImage,
    reset,
    previewImage,
    isLoading,
    error,
    result,
    status,
  } = useRemix();

  const { startTransition, loadingRemixId } = useSplatTransition();

  const [prompt, setPrompt] = useState("");
  const [holdingCompare, setHoldingCompare] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch thumbnails for remixes that don't have them
  useEffect(() => {
    for (const remix of remixes) {
      if (!remix.thumbnail && remix.remoteId) {
        fetchWorldThumbnail(remix.remoteId).then((url) => {
          if (url) {
            setRemixThumbnail(remix.id, url);
          }
        });
      }
    }
  }, [remixes, setRemixThumbnail]);

  const handlePreview = async () => {
    if (!prompt.trim()) return;
    try {
      await preview(prompt, assets?.panoUrl || undefined);
    } catch {
      // Error is set in useRemix
    }
  };

  const handleGenerate = async () => {
    if (!previewImage) return;
    try {
      await generate(prompt, previewImage);
    } catch {
      // Error is set in useRemix
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      uploadImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryClick = (remix: RemixEntry) => {
    startTransition(remix, () => {
      onCancel();
    });
  };

  // Success state after generation
  if (result) {
    return (
      <div className="flex flex-col gap-4">
        <div className="border border-green-800 bg-green-950/50 p-4">
          <div className="font-mono text-sm font-bold uppercase text-green-400">
            World Generated
          </div>
          <div className="mt-2 font-mono text-xs text-green-300/70">
            Your remix has been created and shared with all players in this
            world.
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              reset();
            }}
            className="flex-1 border border-neutral-600 bg-black px-6 py-3 font-mono text-sm font-bold uppercase text-white transition-colors hover:bg-neutral-900"
          >
            New Remix
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-white bg-white px-6 py-3 font-mono text-sm font-bold uppercase text-black transition-colors hover:bg-neutral-200"
          >
            Return to Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Gallery Section */}
      {remixes.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm font-bold uppercase text-neutral-400">
            Variants
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {remixes.map((remix) => (
              <button
                key={remix.id}
                onClick={() => handleGalleryClick(remix)}
                disabled={!!loadingRemixId}
                className="group relative border border-neutral-700 bg-neutral-900 p-2 text-left transition-colors hover:border-white disabled:opacity-50"
              >
                {remix.thumbnail ? (
                  <img
                    src={remix.thumbnail}
                    alt={remix.name}
                    className="mb-1 h-16 w-full object-cover"
                  />
                ) : (
                  <div className="mb-1 flex h-16 w-full items-center justify-center bg-neutral-800">
                    <span className="font-mono text-xs text-neutral-600">
                      Loading...
                    </span>
                  </div>
                )}
                <div className="font-mono text-xs text-white truncate">
                  {remix.name}
                </div>
                {loadingRemixId === remix.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <span className="font-mono text-xs text-white animate-pulse">
                      Loading...
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview Area */}
      {(previewImage || assets?.panoUrl) && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-sm font-bold uppercase text-neutral-400">
              {holdingCompare ? "Original" : previewImage ? "Preview" : "Current Pano"}
            </label>
            {previewImage && assets?.panoUrl && (
              <button
                onMouseDown={() => setHoldingCompare(true)}
                onMouseUp={() => setHoldingCompare(false)}
                onMouseLeave={() => setHoldingCompare(false)}
                className="font-mono text-xs uppercase text-neutral-500 hover:text-white transition-colors select-none"
              >
                Hold to Compare
              </button>
            )}
          </div>
          <div className="border border-neutral-700 bg-neutral-900">
            <img
              src={holdingCompare ? assets?.panoUrl : (previewImage || assets?.panoUrl || "")}
              alt="Preview"
              className="h-32 w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* No Pano Warning */}
      {isHub && !assets?.panoUrl && (
        <div className="border border-neutral-700 bg-neutral-900 p-4 text-center">
          <span className="font-mono text-xs uppercase text-neutral-500">
            No panorama available in hub
          </span>
        </div>
      )}

      {/* Create New Remix */}
      <div className="flex flex-col gap-3">
        <label className="font-mono text-sm font-bold uppercase text-neutral-400">
          Create New Remix
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your remix style..."
          rows={2}
          className="w-full border border-neutral-700 bg-neutral-900 px-4 py-3 font-mono text-sm text-white placeholder-neutral-600 focus:border-white focus:outline-none focus:ring-1 focus:ring-white resize-none"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border border-neutral-700 bg-neutral-900 px-4 py-2 font-mono text-xs font-bold uppercase text-neutral-400 transition-colors hover:border-white hover:text-white"
        >
          Upload Image
        </button>
      </div>

      {/* Status / Error */}
      {status && (
        <div className="font-mono text-xs uppercase text-neutral-400 animate-pulse">
          {status}
        </div>
      )}
      {error && (
        <div className="font-mono text-xs uppercase text-red-400">{error}</div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-neutral-600 bg-black px-6 py-3 font-mono text-sm font-bold uppercase text-white transition-colors hover:bg-neutral-900"
        >
          Abort
        </button>
        {!previewImage ? (
          <button
            type="button"
            onClick={handlePreview}
            disabled={isLoading || !prompt.trim()}
            className="flex-1 border border-white bg-white px-6 py-3 font-mono text-sm font-bold uppercase text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-600 disabled:border-neutral-600"
          >
            {isLoading ? "Generating..." : "Preview"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex-1 border border-white bg-white px-6 py-3 font-mono text-sm font-bold uppercase text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-600 disabled:border-neutral-600"
          >
            {isLoading ? "Generating..." : "Generate World"}
          </button>
        )}
      </div>
    </div>
  );
};
