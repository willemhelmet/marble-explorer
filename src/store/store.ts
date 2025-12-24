import { create } from "zustand";
import { type GameSlice, createGameSlice } from "./gameSlice";

export const useMyStore = create<GameSlice>()(
  (...a) => ({
    ...createGameSlice(...a),
  }),
);
