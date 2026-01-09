// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Portal } from "./Portal";
import { useMyStore } from "../store/store";
import * as apiService from "../services/apiService";
import * as THREE from "three";

const { mockCharacterPosition } = vi.hoisted(() => ({
    mockCharacterPosition: {
        x: 12, y: 0, z: -8,
        clone: function() { return { ...this }; }
    }
}));

vi.mock("bvhecctrl", () => ({
    characterStatus: {
        position: mockCharacterPosition
    }
}));

let mockCameraPosition = new THREE.Vector3(10, 10, 10);

// Mock R3F and Drei
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn((cb) => {
      // Trigger it manually in tests
      (global as any).triggerUseFrame = cb;
  }),
  useThree: vi.fn((selector) => {
    const state = {
      camera: {
        position: mockCameraPosition,
      },
    };
    return selector ? selector(state) : state;
  }),
}));

vi.mock("@react-three/drei", () => ({
  Sphere: ({ children, onPointerOver, onPointerOut, onClick, ...props }: any) => (
    <mesh {...props} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
        {children}
    </mesh>
  ),
  Text: ({ children, ...props }: any) => <mesh {...props}>{children}</mesh>,
}));

// Mock THREE elements
const originalCreateElement = document.createElement.bind(document);
document.createElement = (tagName: string, options?: any) => {
    const el = originalCreateElement(tagName, options);
    if (tagName === "group") {
        (el as any).getWorldPosition = (vec: THREE.Vector3) => {
            // Match the portal position set in the test
            // Since mockPortal position is (3, 0.5, -5)
            vec.set(3, 0.5, -5); 
            return vec;
        };
    }
    return el;
};

// Mock the API service
vi.mock("../services/apiService", () => ({
  fetchWorldAssets: vi.fn(),
  extractWorldIdFromUrl: vi.fn((url) => {
      if (url === "hub") return "hub";
      if (url.includes("uuid")) return "uuid-123";
      return null;
  }),
}));

// Mock the store
const mockSetAssets = vi.fn();
const mockUpdatePortal = vi.fn();
const mockSwitchWorld = vi.fn();
const mockSetWorldAnchorPosition = vi.fn();

vi.mock("../store/store", () => ({
  useMyStore: vi.fn(),
}));

describe("Portal", () => {
  const mockPortal: any = {
    id: "portal-1",
    position: new THREE.Vector3(3, 0.5, -5),
    url: "https://marble.worldlabs.ai/world/uuid",
    status: "ready",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useMyStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: any) => {
        const state = {
            openPortalUI: vi.fn(),
            setIsHovered: vi.fn(),
            currentWorldId: "hub",
            setEditingPortal: vi.fn(),
            switchWorld: mockSwitchWorld,
            setAssets: mockSetAssets,
            setWorldAnchorPosition: mockSetWorldAnchorPosition,
            updatePortal: mockUpdatePortal,
            worldAnchorPosition: new THREE.Vector3(0, 0, 0),
        };
        return selector(state);
    });
  });

  afterEach(() => {
      cleanup();
  });

  it("should anchor new world to character position upon entry", async () => {
    const assets = {
        splatUrl: "test-splat",
        meshUrl: "test-mesh",
        panoUrl: "test-pano",
    };
    (apiService.fetchWorldAssets as any).mockResolvedValue(assets);

    render(<Portal portal={mockPortal} />);

    // Mock camera being close to the portal
    mockCameraPosition.set(3, 0.5, -5);

    const triggerUseFrame = (global as any).triggerUseFrame;
    if (triggerUseFrame) {
        triggerUseFrame();
    }

    await vi.waitFor(() => {
        expect(mockSetWorldAnchorPosition).toHaveBeenCalledWith(expect.objectContaining({
            x: 12,
            y: 0,
            z: -8
        }));
        expect(mockSetAssets).toHaveBeenCalledWith(assets);
        expect(mockSwitchWorld).toHaveBeenCalledWith("uuid-123");
    });
  });

  it("should reset assets when navigating to hub", async () => {
    const hubPortal = { ...mockPortal, url: "hub" };
    render(<Portal portal={hubPortal} />);

    mockCameraPosition.set(3, 0.5, -5);

    const triggerUseFrame = (global as any).triggerUseFrame;
    if (triggerUseFrame) {
        triggerUseFrame();
    }

    await vi.waitFor(() => {
        expect(mockSwitchWorld).toHaveBeenCalledWith("hub");
        expect(mockSetAssets).toHaveBeenCalledWith(null);
        expect(mockSetWorldAnchorPosition).toHaveBeenCalledWith(expect.objectContaining({ x: 0, y: 0, z: 0 }));
    });
  });
});