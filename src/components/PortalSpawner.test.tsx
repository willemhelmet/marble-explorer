// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { PortalSpawner } from "./PortalSpawner";
import { useMyStore } from "../store/store";

// Mock store
const mockAddPortal = vi.fn();
const mockSetEditingPortal = vi.fn();
const mockOpenPortalUI = vi.fn();

vi.mock("../store/store", () => ({
  useMyStore: vi.fn(),
}));

// Global to hold the trigger
const mocks = vi.hoisted(() => ({
    triggerKey: null as any,
    // Simulate Vector3 behavior minimally
    characterPosition: {
        x: 15, y: 0, z: 0,
        clone: function() { return { ...this }; },
        sub: function(v: any) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        }
    },
    worldAnchorPosition: { x: 10, y: 0, z: 0 }
}));

vi.mock("@react-three/drei", () => ({
  useKeyboardControls: vi.fn(() => [
    (selector: any, cb: any) => {
      mocks.triggerKey = cb;
      return () => {};
    },
  ]),
}));

vi.mock("bvhecctrl", () => ({
  characterStatus: {
    get position() { return mocks.characterPosition; }
  },
}));

describe("PortalSpawner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useMyStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: any) => {
      const state = {
        status: "playing",
        currentWorldId: "world-1",
        addPortal: mockAddPortal,
        setEditingPortal: mockSetEditingPortal,
        openPortalUI: mockOpenPortalUI,
        worldAnchorPosition: mocks.worldAnchorPosition,
      };
      return selector(state);
    });
  });

  it("should spawn portal accounting for worldAnchorPosition offset", () => {
    render(<PortalSpawner />);

    // Trigger spawn
    if (mocks.triggerKey) {
      mocks.triggerKey(true);
    }

    // Expected: playerPos (15) - anchorPos (10) = 5
    expect(mockAddPortal).toHaveBeenCalledWith("world-1", expect.objectContaining({
      position: expect.objectContaining({ x: 5, y: 0, z: 0 })
    }));
  });
});
