import { describe, it, expect, beforeEach } from "vitest";
import { create } from "zustand";
import { createWorldSlice, type WorldSlice, type Portal } from "./worldSlice";
import { Vector3 } from "three";

describe("worldSlice - rotationY", () => {
  let useStore: any;

  beforeEach(() => {
    useStore = create<WorldSlice>()((...a) => ({
      ...createWorldSlice(...a),
    }));
  });

  it("should support rotationY in portals", () => {
    const portal: Portal = {
      id: "rotation-portal",
      position: new Vector3(0, 0, 0),
      rotationY: 1.57,
      url: "http://example.com",
      status: "ready",
    };

    useStore.getState().addPortal("hub", portal);

    const state = useStore.getState();
    const hubPortals = state.worldRegistry["hub"].portals;
    const addedPortal = hubPortals.find((p: Portal) => p.id === "rotation-portal");
    
    expect(addedPortal?.rotationY).toBe(1.57);
  });
});
