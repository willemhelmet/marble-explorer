import { useEffect } from "react";
import { useMyStore } from "../../store/store";
import { fetchWorldAssets } from "../../services/apiService";

export const PortalUI = () => {
  const {
    portalUrl,
    setPortalUrl,
    closePortalUI,
    setPortalStatus,
    setAssets,
    setError,
    pause, // Add this
  } = useMyStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // We cannot immediately lock the pointer after Escape (browser security),
        // so we transition to the Pause menu instead of trying to resume playing.
        pause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pause]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!portalUrl.trim()) return;

    // Start the fetching process
    setPortalStatus("fetching");
    closePortalUI(); // Hide UI immediately so user sees the portal update
    setError(null); // Clear previous errors

    try {
      const assets = await fetchWorldAssets(portalUrl);
      setAssets(assets); // This also sets status to 'ready'
    } catch (err: unknown) {
      console.error("Portal Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch world assets";
      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    closePortalUI();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md border-2 border-white bg-black p-8 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        <h2 className="mb-6 text-center font-mono text-2xl font-bold uppercase tracking-widest text-white">
          Initialise Portal
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="marble-url"
              className="font-mono text-sm font-bold uppercase text-neutral-400"
            >
              Marble API URL
            </label>
            <input
              id="marble-url"
              type="text"
              autoFocus
              value={portalUrl}
              onChange={(e) => setPortalUrl(e.target.value)}
              placeholder="https://marble.worldlabs.ai/world/..."
              className="w-full border border-neutral-700 bg-neutral-900 px-4 py-3 font-mono text-white placeholder-neutral-600 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          <div className="mt-4 flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 border border-neutral-600 bg-black px-6 py-3 font-mono text-sm font-bold uppercase text-white transition-colors hover:bg-neutral-900"
            >
              Abort
            </button>
            <button
              type="submit"
              className="flex-1 border border-white bg-white px-6 py-3 font-mono text-sm font-bold uppercase text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
              disabled={!portalUrl.trim()}
            >
              Engage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
