// @vitest-environment happy-dom
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { PortalTabs, type Tab } from "./PortalTabs";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});

describe("PortalTabs", () => {
  it("renders all tabs when showManage is true", () => {
    const onTabChange = vi.fn();
    render(<PortalTabs activeTab="connect" onTabChange={onTabChange} showManage={true} />);

    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(screen.getByText("Generate")).toBeInTheDocument();
    expect(screen.getByText("Manage")).toBeInTheDocument();
  });

  it("does not render Manage tab when showManage is false", () => {
    const onTabChange = vi.fn();
    render(<PortalTabs activeTab="connect" onTabChange={onTabChange} showManage={false} />);

    expect(screen.getByText("Connect")).toBeInTheDocument();
    expect(screen.getByText("Generate")).toBeInTheDocument();
    expect(screen.queryByText("Manage")).not.toBeInTheDocument();
  });

  it("calls onTabChange when a tab is clicked", () => {
    const onTabChange = vi.fn();
    render(<PortalTabs activeTab="connect" onTabChange={onTabChange} showManage={true} />);

    fireEvent.click(screen.getByText("Generate"));
    expect(onTabChange).toHaveBeenCalledWith("generate");
  });

  it("highlights the active tab", () => {
    const onTabChange = vi.fn();
    render(<PortalTabs activeTab="generate" onTabChange={onTabChange} showManage={true} />);

    const generateTab = screen.getByText("Generate");
    const connectTab = screen.getByText("Connect");

    // Check for active class (bg-white text-black) vs inactive (bg-black text-neutral-500)
    expect(generateTab).toHaveClass("bg-white");
    expect(generateTab).toHaveClass("text-black");
    
    expect(connectTab).toHaveClass("bg-black");
    expect(connectTab).toHaveClass("text-neutral-500");
  });
});
