// @vitest-environment happy-dom
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { GenerateTab } from "./GenerateTab";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});

describe("GenerateTab", () => {
  it("renders text area and file input", () => {
    const onGenerate = vi.fn();
    render(<GenerateTab onGenerate={onGenerate} />);

    expect(screen.getByPlaceholderText(/describe your world/i)).toBeInTheDocument();
    expect(screen.getByText(/upload reference image/i)).toBeInTheDocument();
    expect(screen.getByText(/engage/i)).toBeInTheDocument();
  });

  it("calls onGenerate with inputs", () => {
    const onGenerate = vi.fn();
    render(<GenerateTab onGenerate={onGenerate} />);

    const textarea = screen.getByPlaceholderText(/describe your world/i);
    fireEvent.change(textarea, { target: { value: "A beautiful forest" } });

    // Mock file upload if possible, or just check text for now
    fireEvent.click(screen.getByText(/engage/i));
    
    expect(onGenerate).toHaveBeenCalledWith("A beautiful forest", null);
  });
});
