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
        clone: function() { return { ...this, add: (v: any) => { this.x += v.x; this.y += v.y; this.z += v.z; return this; } }; },
        sub: function(v: any) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        },
        add: function(v: any) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        }
    },
    worldAnchorPosition: { x: 10, y: 0, z: 0 },
    cameraDirection: { x: 0, y: 0, z: -1 } // Facing North
}));

vi.mock("@react-three/fiber", () => ({
    useThree: () => ({
        camera: {
            getWorldDirection: (target: any) => {
                target.x = mocks.cameraDirection.x;
                target.y = mocks.cameraDirection.y;
                target.z = mocks.cameraDirection.z;
                return target;
            }
        }
    })
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
    // PLUS 1.5m in front (facing -Z means z should be -1.5)
    // But wait, the previous test expected just 5. I should update that expectation or add a new one.
    // Let's update the existing one to reflect the new requirement.
    
    expect(mockAddPortal).toHaveBeenCalledWith("world-1", expect.objectContaining({
      position: expect.objectContaining({ 
          x: 5, // 15 - 10 + (0 * 1.5)
          y: 0, 
          z: -1.5 // 0 - 0 + (-1 * 1.5)
      })
    }));
  });
});
