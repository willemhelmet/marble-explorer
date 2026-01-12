// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Portal } from "./Portal";
import { useMyStore } from "../store/store";
import * as apiService from "../services/apiService";
import * as THREE from "three";

// Mock characterStatus (Yaw ~90 degrees)
vi.mock("bvhecctrl", () => ({
    characterStatus: {
        position: { x: 10, y: 0, z: 10, clone: () => ({ x: 10, y: 0, z: 10 }), toArray: () => [10, 0, 10] },
        quaternion: { x: 0, y: 0.7071, z: 0, w: 0.7071 } // This should be IGNORED now
    }
}));

// Mock THREE elements
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn((cb) => { (globalThis as any).triggerUseFrame = cb; }),
  useThree: vi.fn((selector) => {
    const state = { camera: { position: { distanceTo: () => 0.5 } } };
    return selector ? selector(state) : state;
  }),
}));

vi.mock("@react-three/drei", () => ({
  Sphere: (props: any) => <mesh {...props} />,
  Text: (props: any) => <mesh {...props} />,
  Billboard: (props: any) => <group {...props} />,
}));

// Mock API
vi.mock("../services/apiService", () => ({
  fetchWorldAssets: vi.fn().mockResolvedValue({}),
  extractWorldIdFromUrl: vi.fn(() => "uuid"),
}));

// Mock store
const mockSetWorldAnchorOrientation = vi.fn();
const mockSetAssets = vi.fn();
const mockSwitchWorld = vi.fn();

vi.mock("../store/store", () => ({
  useMyStore: vi.fn(),
}));

describe("Portal Rotation Logic", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    (useMyStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: any) => {
        return selector({
            openPortalUI: vi.fn(),
            setIsHovered: vi.fn(),
            currentWorldId: "hub",
            setEditingPortal: vi.fn(),
            switchWorld: mockSwitchWorld,
            setAssets: mockSetAssets,
            setWorldAnchorPosition: vi.fn(),
            setWorldAnchorOrientation: mockSetWorldAnchorOrientation,
            updatePortal: vi.fn(),
            worldAnchorPosition: new THREE.Vector3(0, 0, 0),
        });
    });
  });

  it("should set world anchor orientation from stored portal rotationY, NOT character rotation", async () => {
    // Portal has stored rotation of 180 degrees (PI)
    const storedRotationY = Math.PI;
    
    const mockPortal: any = {
      id: "portal-1",
      position: new THREE.Vector3(0, 0, 0),
      url: "https://marble.worldlabs.ai/world/uuid",
      status: "ready",
      rotationY: storedRotationY 
    };

    // Need to mock group ref world position
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = (tagName: string, options?: any) => {
        const el = originalCreateElement(tagName, options);
        if (tagName === "group") {
            (el as any).getWorldPosition = (vec: THREE.Vector3) => vec.set(0, 0, 0);
        }
        return el;
    };

    render(<Portal portal={mockPortal} />);

    // Trigger frame
    const triggerUseFrame = (globalThis as any).triggerUseFrame;
    if (triggerUseFrame) triggerUseFrame();

    await vi.waitFor(() => {
        // Expect setWorldAnchorOrientation to be called with Euler(0, PI, 0)
        // NOT the character rotation (PI/2)
        expect(mockSetWorldAnchorOrientation).toHaveBeenCalledWith(
            expect.objectContaining({
                x: 0,
                y: storedRotationY + Math.PI,
                z: 0
            })
        );
    });
  });
});
