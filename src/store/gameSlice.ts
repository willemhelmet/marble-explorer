import { type StateCreator } from "zustand";

export type GameStatus = "intro" | "playing" | "paused" | "portal_open";

export interface GameSlice {
  status: GameStatus;
  isMobile: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  openPortalUI: () => void;
  closePortalUI: () => void;
}

export const createGameSlice: StateCreator<
  GameSlice,
  [],
  [],
  GameSlice
> = (set) => ({
  status: "intro",
  isMobile: "ontouchstart" in window || navigator.maxTouchPoints > 0,
  start: () => set(() => ({ status: "playing" })),
  pause: () => set(() => ({ status: "paused" })),
  resume: () => set(() => ({ status: "playing" })),
  openPortalUI: () => set(() => ({ status: "portal_open" })),
  closePortalUI: () => set(() => ({ status: "playing" })),
});
