import { type StateCreator } from "zustand";
import { Euler, Vector3, Quaternion } from "three";

export interface RemotePlayer {
  id: string;
  position: Vector3;
  rotation: Quaternion;
  room: string;
}

export interface PlayerSlice {
  // --- State ---
  remotePlayers: Map<string, RemotePlayer>;
  teleportRequest: { position: Vector3; rotation: Quaternion } | null;

  // --- Actions ---
  syncPlayers: (players: RemotePlayer[]) => void;
  removePlayer: (id: string) => void;
  requestTeleport: (position: Vector3, rotation: Euler) => void;
  clearTeleportRequest: () => void;
}

export const createPlayerSlice: StateCreator<
  PlayerSlice,
  [],
  [],
  PlayerSlice
> = (set) => ({
  // Initial State
  remotePlayers: new Map(),
  teleportRequest: null,

  // Actions
  syncPlayers: (players) =>
    set(() => {
      const nextMap = new Map<string, RemotePlayer>();
      players.forEach((p) => nextMap.set(p.id, p));
      return { remotePlayers: nextMap };
    }),

  removePlayer: (id) =>
    set((state) => {
      const newMap = new Map(state.remotePlayers);
      newMap.delete(id);
      return { remotePlayers: newMap };
    }),

  requestTeleport: (position, rotation) =>
    set(() => ({
      teleportRequest: {
        position,
        rotation: new Quaternion().setFromEuler(rotation),
      },
    })),

  clearTeleportRequest: () =>
    set(() => ({
      teleportRequest: null,
    })),
});