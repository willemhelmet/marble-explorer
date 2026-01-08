import { type StateCreator } from "zustand";
import { Vector3 } from "three";

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

export interface PortalSlice {
  // --- State ---
  /** The downloaded asset URLs from the Marble API */
  assets: WorldAssets | null;
  /** Error message to display if the API call or loading fails */
  error: string | null;
  /** Tracks if the crosshair is hovering over the portal */
  isHovered: boolean;
  /** The position of the portal that was entered, used to anchor world assets */
  worldAnchorPosition: Vector3;

  // --- Actions ---
  setAssets: (assets: WorldAssets | null) => void;
  setError: (error: string | null) => void;
  setIsHovered: (isHovered: boolean) => void;
  setWorldAnchorPosition: (position: Vector3) => void;
  /** Resets the portal to its initial idle state and clears assets */
  resetPortal: () => void;
}

export const createPortalSlice: StateCreator<
  PortalSlice,
  [],
  [],
  PortalSlice
> = (set) => ({
  // Initial State
  assets: null,
  error: null,
  isHovered: false,
  worldAnchorPosition: new Vector3(0, 1, -3),

  // Actions
  setAssets: (assets) => set({ assets }),
  setError: (error) => set({ error }),
  setIsHovered: (isHovered) => set({ isHovered }),
  setWorldAnchorPosition: (position) => set({ worldAnchorPosition: position }),
  resetPortal: () =>
    set({
      assets: null,
      error: null,
      isHovered: false,
    }),
});
