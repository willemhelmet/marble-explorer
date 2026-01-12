// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { PortalUI } from "./PortalUI";
import { useMyStore } from "../../store/store";
import * as apiService from "../../services/apiService";
import { socketManager } from "../../services/socketManager";
import { Vector3 } from "three";

// Mock deps
vi.mock("../../services/apiService", () => ({
  fetchWorldAssets: vi.fn(),
  extractWorldIdFromUrl: vi.fn((url) => (url.includes("uuid") ? "uuid" : null)),
}));

vi.mock("../../services/socketManager", () => ({
    socketManager: {
        createPortal: vi.fn(),
    }
}));

// Mock characterStatus
vi.mock("bvhecctrl", () => ({
  characterStatus: {
    quaternion: { x: 0, y: 0.7071, z: 0, w: 0.7071 }, // ~90 degrees Y
  },
}));

vi.mock("../../store/store", () => ({
  useMyStore: vi.fn(),
}));

describe("PortalUI Rotation Capture", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    (useMyStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: any) => {
        const state = {
            closePortalUI: vi.fn(),
            setAssets: vi.fn(),
            setError: vi.fn(),
            pause: vi.fn(),
            editingPortal: { worldId: "hub", portalId: "portal-1" },
            updatePortal: vi.fn(),
            setEditingPortal: vi.fn(),
            removePortal: vi.fn(),
            worldRegistry: {
                "hub": {
                    portals: [
                        { id: "portal-1", position: new Vector3(10, 0, 10), rotationY: 0, status: "idle" }
                    ]
                }
            }
        };
        return selector(state);
    });
  });

  it("should capture character yaw rotation and send it to server", async () => {
    (apiService.fetchWorldAssets as any).mockResolvedValue({});
    
    render(<PortalUI />);
    const input = screen.getByPlaceholderText(/https:\/\/marble.worldlabs.ai\/world\/.*/i);
    fireEvent.change(input, { target: { value: "https://marble.worldlabs.ai/world/uuid" } });
    fireEvent.click(screen.getByText("Engage"));

    await waitFor(() => {
        // Expected rotation: 90 degrees (approx 1.57 rad)
        // From Quaternion(0, 0.7071, 0, 0.7071)
        
        expect(socketManager.createPortal).toHaveBeenCalledWith(
            expect.any(Object), // position
            expect.closeTo(1.57, 0.01), // rotationY
            expect.any(String) // url
        );
    });
  });
});
