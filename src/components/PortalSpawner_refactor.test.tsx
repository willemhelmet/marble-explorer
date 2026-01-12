// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { PortalSpawner } from "./PortalSpawner";
import { useMyStore } from "../store/store";

// Mock store
const mockAddPortal = vi.fn();
const mockOpenPortalUI = vi.fn();

vi.mock("../store/store", () => ({
  useMyStore: vi.fn(),
}));

// Mock hook trigger
const mocks = vi.hoisted(() => ({
    triggerKey: null as any
}));

vi.mock("@react-three/drei", () => ({
  useKeyboardControls: vi.fn(() => [
    (_selector: any, cb: any) => {
      mocks.triggerKey = cb;
      return () => {};
    },
  ]),
}));

vi.mock("@react-three/fiber", () => ({
    useThree: () => ({
        camera: {
            getWorldDirection: vi.fn()
        }
    })
}));

// Mock bvhecctrl
vi.mock("bvhecctrl", () => ({
  characterStatus: {
    position: {
        clone: () => ({ add: () => ({ sub: () => ({ applyQuaternion: () => ({}) }) }) })
    }
  },
}));

describe("PortalSpawner Refactor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useMyStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: any) => {
      const state = {
        status: "playing",
        currentWorldId: "world-1",
        addPortal: mockAddPortal,
        setEditingPortal: vi.fn(),
        openPortalUI: mockOpenPortalUI,
        worldAnchorPosition: { x: 0, y: 0, z: 0 },
        worldAnchorOrientation: { x: 0, y: 0, z: 0 },
      };
      return selector(state);
    });
  });

  it("should open UI WITHOUT spawning a portal", () => {
    render(<PortalSpawner />);

    if (mocks.triggerKey) {
      mocks.triggerKey(true);
    }

    expect(mockOpenPortalUI).toHaveBeenCalled();
    expect(mockAddPortal).not.toHaveBeenCalled();
  });
});
