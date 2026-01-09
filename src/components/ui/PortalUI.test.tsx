// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { PortalUI } from "./PortalUI";
import { useMyStore } from "../../store/store";
import * as apiService from "../../services/apiService";

// Mock the API service
vi.mock("../../services/apiService", () => ({
  fetchWorldAssets: vi.fn(),
  extractWorldIdFromUrl: vi.fn((url) => {
      if (url.includes("uuid")) return "uuid";
      return null;
  }),
}));

// Mock the store
const mockSetAssets = vi.fn();
const mockUpdatePortal = vi.fn();
const mockClosePortalUI = vi.fn();
const mockSetError = vi.fn();
const mockSetEditingPortal = vi.fn();

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
        };
        return selector(state);
    });
  });

  it("should update portal registry but NOT set global assets upon submission", async () => {
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
        // Validation 1: Portal registry should be updated
        expect(mockUpdatePortal).toHaveBeenCalledWith("hub", "portal-1", expect.objectContaining({
            status: "ready"
        }));
    });

    // Validation 2: Global assets should NOT be set (This is the key fix)
    expect(mockSetAssets).not.toHaveBeenCalled(); 
  });

  it("should update the portal with the correct URL", async () => {
    render(<PortalUI />);

    const testUrl = "https://marble.worldlabs.ai/world/uuid-123";
    const input = screen.getByPlaceholderText(/https:\/\/marble.worldlabs.ai\/world\/.*/i);
    fireEvent.change(input, { target: { value: testUrl } });

    const button = screen.getByText("Engage");
    fireEvent.click(button);

    await waitFor(() => {
        expect(mockUpdatePortal).toHaveBeenCalledWith("hub", "portal-1", expect.objectContaining({
            url: testUrl
        }));
    });
  });
});
