import { type StateCreator } from "zustand";

export type GameStatus = "intro" | "playing" | "paused" | "portal_open";
export type PortalUITab = "generate" | "remix" | "connect" | "manage";

export interface GameSlice {
  status: GameStatus;
  isMobile: boolean;
  isHovered: boolean; // Tracks if the crosshair is hovering over an interactive element
  portalUIInitialTab: PortalUITab;
  start: () => void;
  pause: () => void;
  resume: () => void;
  openPortalUI: (initialTab?: PortalUITab) => void;
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
  portalUIInitialTab: "generate",
  start: () => set(() => ({ status: "playing" })),
  pause: () => set(() => ({ status: "paused" })),
  resume: () => set(() => ({ status: "playing" })),
  openPortalUI: (initialTab) =>
    set(() => ({
      status: "portal_open",
      portalUIInitialTab: initialTab || "generate",
    })),
  closePortalUI: () => set(() => ({ status: "playing" })),
  setIsHovered: (isHovered) => set({ isHovered }),
});
