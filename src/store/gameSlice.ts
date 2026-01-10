import { type StateCreator } from "zustand";

export type GameStatus = "intro" | "playing" | "paused" | "portal_open";

export interface GameSlice {
  status: GameStatus;
  isMobile: boolean;
  isHovered: boolean; // Tracks if the crosshair is hovering over an interactive element
  start: () => void;
  pause: () => void;
  resume: () => void;
  openPortalUI: () => void;
  closePortalUI: () => void;
  setIsHovered: (isHovered: boolean) => void;
}

export const createGameSlice: StateCreator<
  GameSlice,
  [],
  [],
  GameSlice
> = (set) => ({
  status: "intro",
  isMobile: "ontouchstart" in window || navigator.maxTouchPoints > 0,
  isHovered: false,
  start: () => set(() => ({ status: "playing" })),
  pause: () => set(() => ({ status: "paused" })),
  resume: () => set(() => ({ status: "playing" })),
  openPortalUI: () => set(() => ({ status: "portal_open" })),
  closePortalUI: () => set(() => ({ status: "playing" })),
  setIsHovered: (isHovered) => set({ isHovered }),
});
