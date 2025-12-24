import { create } from "zustand";
import { type GameSlice, createGameSlice } from "./gameSlice";
import { type PortalSlice, createPortalSlice } from "./portalSlice";

export type StoreState = GameSlice & PortalSlice;

export const useMyStore = create<StoreState>()(
  (...a) => ({
    ...createGameSlice(...a),
    ...createPortalSlice(...a),
  }),
);
