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
  /** The Marble API URL input by the user */
  portalUrl: string;
  /** Current state of the portal and API interaction */
  portalStatus: PortalStatus;
  /** The downloaded asset URLs from the Marble API */
  assets: WorldAssets | null;
  /** Error message to display if the API call or loading fails */
  error: string | null;
  /** Tracks if the player has entered the portal sphere */
  isPlayerInside: boolean;
  /** Tracks if the crosshair is hovering over the portal */
  isHovered: boolean;
  /** WHP: not sure if this is the right place to put this,
   * but for the time being we want to store the position of
   * a portal as a part of our state, since in the near feature
   * we will have multiple portals, and the position of the
   * portal will impact the position of the splat*/
  position: Vector3;

  // --- Actions ---
  setPortalUrl: (url: string) => void;
  setPortalStatus: (status: PortalStatus) => void;
  setAssets: (assets: WorldAssets | null) => void;
  setError: (error: string | null) => void;
  setIsPlayerInside: (isInside: boolean) => void;
  setIsHovered: (isHovered: boolean) => void;
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
  assets: null,
  error: null,
  isPlayerInside: false,
  isHovered: false,
  position: new Vector3(0, 1, -3),

  // Actions
  setPortalUrl: (url) => set({ portalUrl: url }),
  setPortalStatus: (status) => set({ portalStatus: status }),
  setAssets: (assets) =>
    set({ assets, portalStatus: assets ? "ready" : "idle" }),
  setError: (error) => set({ error, portalStatus: "error" }),
  setIsPlayerInside: (isInside) => set({ isPlayerInside: isInside }),
  setIsHovered: (isHovered) => set({ isHovered }),
  resetPortal: () =>
    set({
      portalUrl: "",
      portalStatus: "idle",
      assets: null,
      error: null,
      isPlayerInside: false,
      isHovered: false,
    }),
});
