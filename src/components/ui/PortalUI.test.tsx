// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { PortalUI } from "./PortalUI";
import { useMyStore } from "../../store/store";
import * as apiService from "../../services/apiService";
import { socketManager } from "../../services/socketManager";
import { Vector3 } from "three";

// Mock the API service
vi.mock("../../services/apiService", () => ({
  fetchWorldAssets: vi.fn(),
  extractWorldIdFromUrl: vi.fn((url) => {
      if (url.includes("uuid")) return "uuid";
      return null;
  }),
}));

// Mock socketManager
vi.mock("../../services/socketManager", () => ({
    socketManager: {
        createPortal: vi.fn(),
    }
}));

// Mock the store
const mockSetAssets = vi.fn();
const mockUpdatePortal = vi.fn();
const mockClosePortalUI = vi.fn();
const mockSetError = vi.fn();
const mockSetEditingPortal = vi.fn();
const mockRemovePortal = vi.fn();

vi.mock("../../store/store", () => ({
  useMyStore: vi.fn(),
}));

describe("PortalUI", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (useMyStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector: any) => {
        const state = {
            closePortalUI: mockClosePortalUI,
            setAssets: mockSetAssets,
            setError: mockSetError,
            pause: vi.fn(),
            editingPortal: { worldId: "hub", portalId: "portal-1" },
            updatePortal: mockUpdatePortal,
            setEditingPortal: mockSetEditingPortal,
            removePortal: mockRemovePortal,
            worldRegistry: {
                "hub": {
                    portals: [
                        { id: "portal-1", position: new Vector3(10, 0, 10), status: "idle" }
                    ]
                }
            }
        };
        return selector(state);
    });
  });

  it("should create server portal and remove local portal upon submission", async () => {
    // Setup API mock to resolve successfully
    (apiService.fetchWorldAssets as any).mockResolvedValue({
        splatUrl: "http://example.com/splat.spz",
        meshUrl: "http://example.com/mesh.glb",
        panoUrl: "http://example.com/pano.jpg",
    });

    render(<PortalUI />);

    // Enter URL
    const input = screen.getByPlaceholderText(/https:\/\/marble.worldlabs.ai\/world\/.*/i);
    fireEvent.change(input, { target: { value: "https://marble.worldlabs.ai/world/uuid" } });

    // Click Engage
    const button = screen.getByText("Engage");
    fireEvent.click(button);

    // Wait for async operations
    await waitFor(() => {
        // Validation 1: Socket request sent
        expect(socketManager.createPortal).toHaveBeenCalledWith(
            expect.objectContaining({ x: 10, y: 0, z: 10 }),
            "https://marble.worldlabs.ai/world/uuid"
        );
        
        // Validation 2: Local portal removed
        expect(mockRemovePortal).toHaveBeenCalledWith("hub", "portal-1");
    });
  });
});
