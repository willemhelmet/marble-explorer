import { create } from "zustand";
import { type GameSlice, createGameSlice } from "./gameSlice";
import { type PortalSlice, createPortalSlice } from "./portalSlice";
import { type WorldSlice, createWorldSlice } from "./worldSlice";

export type StoreState = GameSlice & PortalSlice & WorldSlice;

export const useMyStore = create<StoreState>()((...a) => ({
  ...createGameSlice(...a),
  ...createPortalSlice(...a),
  ...createWorldSlice(...a),
}));
