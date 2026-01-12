import { useEffect, useState } from "react";
import { useMyStore } from "../../store/store";
import { fetchWorldAssets } from "../../services/apiService";
import { socketManager } from "../../services/socketManager";
import { characterStatus } from "bvhecctrl";
import { Euler, Quaternion, Vector3 } from "three";

export const PortalUI = () => {
  const [urlInput, setUrlInput] = useState("");
  const closePortalUI = useMyStore((state) => state.closePortalUI);
  const setError = useMyStore((state) => state.setError);
  const pause = useMyStore((state) => state.pause);
  const worldAnchorPosition = useMyStore((state) => state.worldAnchorPosition);
  const worldAnchorOrientation = useMyStore(
    (state) => state.worldAnchorOrientation,
  );
  
  // Restore selectors for Edit Mode
  const editingPortal = useMyStore((state) => state.editingPortal);
  const worldRegistry = useMyStore((state) => state.worldRegistry);
  const setEditingPortal = useMyStore((state) => state.setEditingPortal);

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

  // Pre-fill URL if editing
  useEffect(() => {
    if (editingPortal) {
      const { worldId, portalId } = editingPortal;
      const existing = worldRegistry[worldId]?.portals.find((p) => p.id === portalId);
      if (existing && existing.url) {
        setUrlInput(existing.url);
      }
    }
  }, [editingPortal, worldRegistry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!urlInput.trim()) return;

    let targetPos: Vector3;
    let targetRot: number;

    if (editingPortal) {
      // --- EDIT MODE ---
      const { worldId, portalId } = editingPortal;
      const existing = worldRegistry[worldId]?.portals.find((p) => p.id === portalId);
      
      if (!existing) {
        // Fallback or error? Close UI
        closePortalUI();
        return;
      }
      
      targetPos = existing.position;
      targetRot = existing.rotationY;

      // "Update" by removing old and creating new (Server limitation work-around)
      // Note: This changes the Portal ID.
      socketManager.removePortal(worldId, portalId);
    } else {
      // --- CREATE MODE ---
      // Capture current player rotation
      const userQuat = new Quaternion(
        characterStatus.quaternion.x,
        characterStatus.quaternion.y,
        characterStatus.quaternion.z,
        characterStatus.quaternion.w,
      );

      // Calculate Yaw
      const userEuler = new Euler(0, 0, 0, "YXZ");
      userEuler.setFromQuaternion(userQuat);
      targetRot = userEuler.y;

          // Calculate Position (1.5m in front)

          const direction = new Vector3(0, 0, 1); // Camera/Character forward in bvhecctrl is +Z

          direction.applyQuaternion(userQuat);

          direction.y = 0; // Flatten to XZ

      
      direction.normalize();
      direction.multiplyScalar(1.5);

      const globalSpawnPos = new Vector3(
        characterStatus.position.x,
        characterStatus.position.y,
        characterStatus.position.z,
      ).add(direction);

      // Transform to Local Coordinate System (relative to World Anchor)
      targetPos = globalSpawnPos.clone().sub(worldAnchorPosition);
      const worldQuat = new Quaternion().setFromEuler(worldAnchorOrientation);
      worldQuat.invert();
      targetPos.applyQuaternion(worldQuat);
    }

    // 1. Request Server to create a global, persistent portal
    socketManager.createPortal(targetPos, targetRot, urlInput);

    // Cleanup
    setEditingPortal(null, null);
    closePortalUI(); // Hide UI immediately
    setError(null); // Clear previous errors

    try {
      // Still fetch assets locally so the creator sees the world loading immediately
      await fetchWorldAssets(urlInput);
    } catch (err: unknown) {
      console.error("Portal Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch world assets";
      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    setEditingPortal(null, null);
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
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
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
              disabled={!urlInput.trim()}
            >
              Engage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

