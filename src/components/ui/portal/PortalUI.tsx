import { useEffect, useState } from "react";
import { useMyStore } from "../../../store/store";
import { fetchWorldAssets } from "../../../services/apiService";
import { socketManager } from "../../../services/socketManager";
import { characterStatus } from "bvhecctrl";
import { Euler, Quaternion, Vector3 } from "three";
import { ConnectTab } from "./ConnectTab";
import { GenerateTab } from "./GenerateTab";
import { ManageTab } from "./ManageTab";
import { PortalTabs, type Tab } from "./PortalTabs";

export const PortalUI = () => {
  const closePortalUI = useMyStore((state) => state.closePortalUI);
  const setError = useMyStore((state) => state.setError);
  const pause = useMyStore((state) => state.pause);
  const worldAnchorPosition = useMyStore((state) => state.worldAnchorPosition);
  const worldAnchorOrientation = useMyStore(
    (state) => state.worldAnchorOrientation,
  );
  const apiKey = useMyStore((state) => state.apiKey);

  // Restore selectors for Edit Mode
  const editingPortal = useMyStore((state) => state.editingPortal);
  const worldRegistry = useMyStore((state) => state.worldRegistry);
  const setEditingPortal = useMyStore((state) => state.setEditingPortal);

  const [activeTab, setActiveTab] = useState<Tab>("connect");

  const [initialUrl] = useState(() => {
    if (editingPortal) {
      const { worldId, portalId } = editingPortal;
      const existing = worldRegistry[worldId]?.portals.find(
        (p) => p.id === portalId,
      );
      if (existing && existing.url) {
        return existing.url;
      }
    }
    return "";
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        pause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pause]);

  const handleConnect = async (url: string) => {
    if (!url.trim()) return;

    let targetPos: Vector3;
    let targetRot: number;

    if (editingPortal) {
      // --- EDIT MODE ---
      const { worldId, portalId } = editingPortal;
      const existing = worldRegistry[worldId]?.portals.find(
        (p) => p.id === portalId,
      );

      if (!existing) {
        closePortalUI();
        return;
      }

      targetPos = existing.position;
      targetRot = existing.rotationY;

      socketManager.removePortal(worldId, portalId);
    } else {
      // --- CREATE MODE ---
      const userQuat = new Quaternion(
        characterStatus.quaternion.x,
        characterStatus.quaternion.y,
        characterStatus.quaternion.z,
        characterStatus.quaternion.w,
      );

      const userEuler = new Euler(0, 0, 0, "YXZ");
      userEuler.setFromQuaternion(userQuat);
      targetRot = userEuler.y;

      const direction = new Vector3(0, 0, 1);
      direction.applyQuaternion(userQuat);
      direction.y = 0;
      direction.normalize();
      direction.multiplyScalar(1.5);

      const globalSpawnPos = new Vector3(
        characterStatus.position.x,
        characterStatus.position.y,
        characterStatus.position.z,
      ).add(direction);

      targetPos = globalSpawnPos.clone().sub(worldAnchorPosition);
      const worldQuat = new Quaternion().setFromEuler(worldAnchorOrientation);
      worldQuat.invert();
      targetPos.applyQuaternion(worldQuat);
    }

    socketManager.createPortal(targetPos, targetRot, url);

    setEditingPortal(null, null);
    closePortalUI();
    setError(null);

    try {
      await fetchWorldAssets(url, apiKey);
    } catch (err: unknown) {
      console.error("Portal Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch world assets";
      setError(errorMessage);
    }
  };

  const handleEngaged = (operationId: string) => {
    if (editingPortal) {
      // --- EDIT MODE: Update existing portal to generating state ---
      socketManager.updatePortal(editingPortal.worldId, editingPortal.portalId, {
        status: "generating",
        pendingOperationId: operationId,
        url: "", // Clear URL while generating
      });
    } else {
      // --- CREATE MODE: Spawn a new portal in generating state ---
      const userQuat = new Quaternion(
        characterStatus.quaternion.x,
        characterStatus.quaternion.y,
        characterStatus.quaternion.z,
        characterStatus.quaternion.w,
      );

      const userEuler = new Euler(0, 0, 0, "YXZ");
      userEuler.setFromQuaternion(userQuat);
      const targetRot = userEuler.y;

      const direction = new Vector3(0, 0, 1);
      direction.applyQuaternion(userQuat);
      direction.y = 0;
      direction.normalize();
      direction.multiplyScalar(1.5);

      const globalSpawnPos = new Vector3(
        characterStatus.position.x,
        characterStatus.position.y,
        characterStatus.position.z,
      ).add(direction);

      const targetPos = globalSpawnPos.clone().sub(worldAnchorPosition);
      const worldQuat = new Quaternion().setFromEuler(worldAnchorOrientation);
      worldQuat.invert();
      targetPos.applyQuaternion(worldQuat);

      socketManager.createPortal(
        targetPos,
        targetRot,
        "", // targetUrl
        "generating",
        operationId,
      );
    }

    setEditingPortal(null, null);
    closePortalUI();
    setError(null);
  };

  const handleDelete = () => {
    if (editingPortal) {
      socketManager.removePortal(editingPortal.worldId, editingPortal.portalId);
    }
    setEditingPortal(null, null);
    closePortalUI();
  };

  const handleCancel = () => {
    setEditingPortal(null, null);
    closePortalUI();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md border-2 border-white bg-black shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        <PortalTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showManage={!!editingPortal}
        />

        {/* Content */}
        <div className="p-8">
          <h2 className="mb-6 text-center font-mono text-2xl font-bold uppercase tracking-widest text-white">
            {activeTab === "connect" && "Connect World"}
            {activeTab === "generate" && "Generate World"}
            {activeTab === "manage" && "Manage Portal"}
          </h2>

          {activeTab === "connect" && (
            <ConnectTab
              onCancel={handleCancel}
              onSubmit={handleConnect}
              initialUrl={initialUrl}
            />
          )}

          {activeTab === "generate" && (
            <GenerateTab onEngaged={handleEngaged} onCancel={handleCancel} />
          )}

          {activeTab === "manage" && (
            <ManageTab onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
};