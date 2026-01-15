// @vitest-environment happy-dom
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from "vitest";
import { PortalUI } from "./PortalUI";
import { useMyStore } from "../../store/store";
import { socketManager } from "../../services/socketManager";
import { fetchWorldAssets } from "../../services/apiService";
import "@testing-library/jest-dom/vitest";

// Mock store
vi.mock("../../store/store", () => ({
  useMyStore: vi.fn(),
}));

// Mock services
vi.mock("../../services/socketManager", () => ({
  socketManager: {
    createPortal: vi.fn(),
    removePortal: vi.fn(),
  },
}));

vi.mock("../../services/apiService", () => ({
  fetchWorldAssets: vi.fn(),
}));

vi.mock("bvhecctrl", () => ({
  characterStatus: {
    position: { x: 0, y: 0, z: 0 },
    quaternion: { x: 0, y: 0, z: 0, w: 1 },
  },
}));

afterEach(() => {
  cleanup();
});

describe("PortalUI", () => {
  const mockClosePortalUI = vi.fn();
  const mockSetError = vi.fn();
  const mockSetEditingPortal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useMyStore as unknown as Mock).mockImplementation((selector) => {
      const state = {
        closePortalUI: mockClosePortalUI,
        setError: mockSetError,
        pause: vi.fn(),
        worldAnchorPosition: { x: 0, y: 0, z: 0 },
        worldAnchorOrientation: { x: 0, y: 0, z: 0 },
        apiKey: "test-key",
        editingPortal: null,
        worldRegistry: {},
        setEditingPortal: mockSetEditingPortal,
      };
      return selector(state);
    });
  });

  it("renders with Connect tab active by default", () => {
    render(<PortalUI />);
    expect(screen.getByText("Connect World")).toBeInTheDocument();
    expect(screen.getByLabelText(/marble api url/i)).toBeInTheDocument();
  });

  it("switches to Generate tab", () => {
    render(<PortalUI />);
    fireEvent.click(screen.getByRole("button", { name: /generate/i }));
    expect(screen.getByText("Generate World")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe your world/i)).toBeInTheDocument();
  });

  it("does not show Manage tab when not editing", () => {
    render(<PortalUI />);
    expect(screen.queryByRole("button", { name: /manage/i })).not.toBeInTheDocument();
  });

  it("shows Manage tab when editingPortal is present", () => {
    (useMyStore as unknown as Mock).mockImplementation((selector) => {
      const state = {
        closePortalUI: mockClosePortalUI,
        setError: mockSetError,
        pause: vi.fn(),
        worldAnchorPosition: { x: 0, y: 0, z: 0 },
        worldAnchorOrientation: { x: 0, y: 0, z: 0 },
        apiKey: "test-key",
        editingPortal: { worldId: "hub", portalId: "1" },
        worldRegistry: {
            hub: { portals: [{ id: "1", url: "http://example.com" }] }
        },
        setEditingPortal: mockSetEditingPortal,
      };
      return selector(state);
    });

    render(<PortalUI />);
    expect(screen.getByRole("button", { name: /manage/i })).toBeInTheDocument();
  });

  it("submits URL in Connect tab", async () => {
    render(<PortalUI />);
    
    const input = screen.getByLabelText(/marble api url/i);
    fireEvent.change(input, { target: { value: "https://marble.worldlabs.ai/world/123" } });
    
    fireEvent.click(screen.getByText(/engage/i));
    
    expect(socketManager.createPortal).toHaveBeenCalled();
    expect(mockClosePortalUI).toHaveBeenCalled();
  });
});
