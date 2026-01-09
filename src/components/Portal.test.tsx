// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Portal } from "./Portal";
import { useMyStore } from "../store/store";
import * as apiService from "../services/apiService";
import * as THREE from "three";

let mockCameraPosition = new THREE.Vector3(10, 10, 10);

// Mock R3F and Drei
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn((cb) => {
      // Expose the callback so we can trigger it manually
      (global as any).triggerUseFrame = cb;
  }),
  useThree: vi.fn((selector) => {
    const state = {
      gl: { domElement: {} },
      camera: {
        position: mockCameraPosition,
      },
    };
    return selector ? selector(state) : state;
  }),
}));

vi.mock("@react-three/drei", () => ({
  Sphere: ({ children, ...props }: any) => <mesh {...props}>{children}</mesh>,
  Text: ({ children, ...props }: any) => <mesh {...props}>{children}</mesh>,
}));

// Mock THREE elements to prevent "unrecognized tag" warnings and provide necessary methods
const originalCreateElement = document.createElement.bind(document);
document.createElement = (tagName: string, options?: any) => {
    const el = originalCreateElement(tagName, options);
    if (tagName === "group") {
        (el as any).getWorldPosition = (vec: THREE.Vector3) => {
            // Return the position of the portal for testing
            vec.set(0, 0, 0); 
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
    position: new THREE.Vector3(0, 0, 0),
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
        };
        return selector(state);
    });
  });

  afterEach(() => {
      cleanup();
  });

  it("should fetch assets and switch world when player enters a ready portal", async () => {
    const assets = {
        splatUrl: "test-splat",
        meshUrl: "test-mesh",
        panoUrl: "test-pano",
    };
    (apiService.fetchWorldAssets as any).mockResolvedValue(assets);

    render(<Portal portal={mockPortal} />);

    // Mock camera being close to the portal
    mockCameraPosition.set(0.5, 0.5, 0.5);

    // Manually trigger the useFrame callback
    const triggerUseFrame = (global as any).triggerUseFrame;
    if (triggerUseFrame) {
        triggerUseFrame();
    }

    // Wait for the async navigation to complete
    await vi.waitFor(() => {
        expect(apiService.fetchWorldAssets).toHaveBeenCalledWith(mockPortal.url);
        expect(mockSetAssets).toHaveBeenCalledWith(assets);
        expect(mockSwitchWorld).toHaveBeenCalledWith("uuid-123");
        expect(mockSetWorldAnchorPosition).toHaveBeenCalledWith(mockPortal.position);
    });
  });

  it("should reset assets when navigating to hub", async () => {
    const hubPortal = { ...mockPortal, url: "hub" };
    render(<Portal portal={hubPortal} />);

    // Mock camera being close
    const { useThree } = await import("@react-three/fiber");
    (useThree as any).mockImplementation((selector: any) => {
        const state = {
            camera: {
                position: new THREE.Vector3(0.5, 0.5, 0.5),
            }
        };
        return selector ? selector(state) : state;
    });

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

  it("should update portal status to error if asset fetch fails", async () => {
    (apiService.fetchWorldAssets as any).mockRejectedValue(new Error("Fetch failed"));

    render(<Portal portal={mockPortal} />);

    // Mock camera being close
    mockCameraPosition.set(0.5, 0.5, 0.5);

    const triggerUseFrame = (global as any).triggerUseFrame;
    if (triggerUseFrame) {
        triggerUseFrame();
    }

    await vi.waitFor(() => {
        expect(mockUpdatePortal).toHaveBeenCalledWith("hub", mockPortal.id, {
            status: "error"
        });
    });
  });
});
