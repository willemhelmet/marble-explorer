import { type StateCreator } from "zustand";
import { Vector3 } from "three";
import { type PortalStatus } from "./portalSlice";
import { mockRegistry } from "./mockRegistryData";

export interface Portal {
  id: string;
  position: Vector3;
  url: string | null;
  status: PortalStatus;
}

export interface World {
  id: string;
  portals: Portal[];
}

export type Registry = Record<string, World>;

export interface WorldSlice {
  worldRegistry: Registry;
  currentWorldId: string;
  editingPortal: { worldId: string; portalId: string } | null;

  // Actions
  addPortal: (worldId: string, portal: Portal) => void;

  updatePortal: (
    worldId: string,
    portalId: string,

    data: Partial<Portal>,
  ) => void;

  switchWorld: (worldId: string) => void;

  setEditingPortal: (worldId: string | null, portalId: string | null) => void;
}

export const createWorldSlice: StateCreator<WorldSlice, [], [], WorldSlice> = (
  set,
) => ({
  worldRegistry: mockRegistry,
  currentWorldId: "hub",
  editingPortal: null,

  addPortal: (worldId, portal) =>
    set((state) => {
      const world = state.worldRegistry[worldId];
      const currentPortals = world ? world.portals : [];
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
});
