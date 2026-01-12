import { type StateCreator } from "zustand";
import { Vector3, Euler } from "three";
import { mockRegistry } from "./mockRegistryData";

export type PortalStatus =
  | "idle"
  | "fetching"
  | "initializing"
  | "ready"
  | "error";

export interface WorldAssets {
  splatUrl: string;
  meshUrl: string;
  panoUrl: string;
}

export interface Portal {
  id: string;
  position: Vector3;
  rotationY: number;
  url: string | null;
  status: PortalStatus;
}

export interface World {
  id: string;
  portals: Portal[];
}

export type Registry = Record<string, World>;

export interface WorldSlice {
  // --- Registry State ---
  worldRegistry: Registry;
  currentWorldId: string;
  editingPortal: { worldId: string; portalId: string } | null;

  // --- Current World State (Moved from PortalSlice) ---
  assets: WorldAssets | null;
  error: string | null;
  worldAnchorPosition: Vector3;
  worldAnchorOrientation: Euler;

  // --- Registry Actions ---
  addPortal: (worldId: string, portal: Portal) => void;
  removePortal: (worldId: string, portalId: string) => void;
  setPortalsForWorld: (worldId: string, portals: Portal[]) => void;

  updatePortal: (
    worldId: string,
    portalId: string,
    data: Partial<Portal>,
  ) => void;

  switchWorld: (worldId: string) => void;

  setEditingPortal: (worldId: string | null, portalId: string | null) => void;

  // --- Current World Actions ---
  setAssets: (assets: WorldAssets | null) => void;
  setError: (error: string | null) => void;
  setWorldAnchorPosition: (position: Vector3) => void;
  setWorldAnchorOrientation: (orientation: Euler) => void;
}

export const createWorldSlice: StateCreator<WorldSlice, [], [], WorldSlice> = (
  set,
) => ({
  // Registry State
  worldRegistry: mockRegistry,
  currentWorldId: "hub",
  editingPortal: null,

  // Current World State
  assets: null,
  error: null,
  worldAnchorPosition: new Vector3(0, 1, 0),
  worldAnchorOrientation: new Euler(0, 0, 0),

  // Registry Actions
  addPortal: (worldId, portal) =>
    set((state) => {
      const world = state.worldRegistry[worldId];
      const currentPortals = world ? world.portals : [];
      if (currentPortals.some((p) => p.id === portal.id)) return state;

      return {
        worldRegistry: {
          ...state.worldRegistry,
          [worldId]: {
            id: worldId,
            portals: [...currentPortals, portal],
          },
        },
      };
    }),

  removePortal: (worldId, portalId) =>
    set((state) => {
      const world = state.worldRegistry[worldId];
      if (!world) return state;
      return {
        worldRegistry: {
          ...state.worldRegistry,
          [worldId]: {
            ...world,
            portals: world.portals.filter((p) => p.id !== portalId),
          },
        },
      };
    }),

  setPortalsForWorld: (worldId, portals) =>
    set((state) => ({
      worldRegistry: {
        ...state.worldRegistry,
        [worldId]: {
          id: worldId,
          portals: portals,
        },
      },
    })),

  updatePortal: (worldId, portalId, data) =>
    set((state) => {
      const world = state.worldRegistry[worldId];

      if (!world) return state;

      const updatedPortals = world.portals.map((p) =>
        p.id === portalId ? { ...p, ...data } : p,
      );

      return {
        worldRegistry: {
          ...state.worldRegistry,
          [worldId]: {
            ...world,
            portals: updatedPortals,
          },
        },
      };
    }),

  switchWorld: (worldId) => set({ currentWorldId: worldId }),

  setEditingPortal: (worldId, portalId) =>
    set(() => ({
      editingPortal: worldId && portalId ? { worldId, portalId } : null,
    })),

  // Current World Actions
  setAssets: (assets) => set({ assets }),
  setError: (error) => set({ error }),
  setWorldAnchorPosition: (position) => set({ worldAnchorPosition: position }),
  setWorldAnchorOrientation: (orientation) =>
    set({ worldAnchorOrientation: orientation }),
});
