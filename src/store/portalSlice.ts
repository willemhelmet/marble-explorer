import { type StateCreator } from "zustand";

export type PortalStatus = "idle" | "fetching" | "initializing" | "ready" | "error";

export interface WorldAssets {
  splatUrl: string;
  meshUrl: string;
  panoUrl: string;
}

export interface PortalSlice {
  // --- State ---
  /** The Marble API URL input by the user */
  portalUrl: string;
  /** Current state of the portal and API interaction */
  portalStatus: PortalStatus;
  /** Controls the visibility of the 2D URL input overlay */
  isPortalUIVisible: boolean;
  /** The downloaded asset URLs from the Marble API */
  assets: WorldAssets | null;
  /** Error message to display if the API call or loading fails */
  error: string | null;
  /** Tracks if the player has entered the portal sphere */
  isPlayerInside: boolean;

  // --- Actions ---
  setPortalUrl: (url: string) => void;
  setPortalStatus: (status: PortalStatus) => void;
  setPortalUIVisible: (visible: boolean) => void;
  setAssets: (assets: WorldAssets | null) => void;
  setError: (error: string | null) => void;
  setIsPlayerInside: (isInside: boolean) => void;
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
  portalUrl: "",
  portalStatus: "idle",
  isPortalUIVisible: false,
  assets: null,
  error: null,
  isPlayerInside: false,

  // Actions
  setPortalUrl: (url) => set({ portalUrl: url }),
  setPortalStatus: (status) => set({ portalStatus: status }),
  setPortalUIVisible: (visible) => set({ isPortalUIVisible: visible }),
  setAssets: (assets) => set({ assets, portalStatus: assets ? "ready" : "idle" }),
  setError: (error) => set({ error, portalStatus: "error" }),
  setIsPlayerInside: (isInside) => set({ isPlayerInside: isInside }),
  resetPortal: () => set({
    portalUrl: "",
    portalStatus: "idle",
    assets: null,
    error: null,
    isPlayerInside: false
  }),
});