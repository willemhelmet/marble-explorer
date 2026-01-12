import { describe, it, expect, beforeEach } from "vitest";
import { create } from "zustand";
import { createWorldSlice, type WorldSlice, type Portal } from "./worldSlice";
import { Vector3 } from "three";
import { mockRegistry } from "./mockRegistryData";

describe("worldSlice", () => {
  let useStore: any;

  beforeEach(() => {
    useStore = create<WorldSlice>()((...a) => ({
      ...createWorldSlice(...a),
    }));
  });

  it("should initialize with default values from mockRegistry", () => {
    const state = useStore.getState();
    expect(state.currentWorldId).toBe("hub");
    expect(state.worldRegistry).toEqual(mockRegistry);
  });

  it("should add a portal to the registry", () => {
    const initialCount = mockRegistry["hub"].portals.length;
    const portal: Portal = {
      id: "new-portal",
      position: new Vector3(10, 0, 0),
      rotationY: 0,
      url: null,
      status: "idle",
    };

    useStore.getState().addPortal("hub", portal);

    const state = useStore.getState();
    const hubPortals = state.worldRegistry["hub"].portals;
    expect(hubPortals).toHaveLength(initialCount + 1);
    expect(hubPortals[hubPortals.length - 1]).toEqual(portal);
  });

  it("should update a portal in the registry", () => {
    const targetPortalId = mockRegistry["hub"].portals[0].id;
    const updates = { url: "https://new-url.com", status: "ready" as const };

    useStore.getState().updatePortal("hub", targetPortalId, updates);

    const state = useStore.getState();
    const updatedPortal = state.worldRegistry["hub"].portals.find(
      (p: Portal) => p.id === targetPortalId,
    );

    expect(updatedPortal?.url).toBe("https://new-url.com");
    expect(updatedPortal?.status).toBe("ready");
  });

  it("should switch the current world", () => {
    useStore.getState().switchWorld("world-a");
    const state = useStore.getState();
    expect(state.currentWorldId).toBe("world-a");
  });

  it("should set and clear the editing portal", () => {
    useStore.getState().setEditingPortal("hub", "p1");
    let state = useStore.getState();
    expect(state.editingPortal).toEqual({ worldId: "hub", portalId: "p1" });

    useStore.getState().setEditingPortal(null, null);
    state = useStore.getState();
    expect(state.editingPortal).toBeNull();
  });
});

