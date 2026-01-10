import { create } from "zustand";
import { type GameSlice, createGameSlice } from "./gameSlice";
//import { type PortalSlice, createPortalSlice } from "./portalSlice";
import { type WorldSlice, createWorldSlice } from "./worldSlice";
import { type PlayerSlice, createPlayerSlice } from "./playerSlice";

export type StoreState = GameSlice & WorldSlice & PlayerSlice;

export const useMyStore = create<StoreState>()((...a) => ({
  ...createGameSlice(...a),
  //...createPortalSlice(...a),
  ...createWorldSlice(...a),
  ...createPlayerSlice(...a),
}));
