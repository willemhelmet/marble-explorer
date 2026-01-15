// @vitest-environment happy-dom
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ConnectTab } from "./ConnectTab";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});

describe("ConnectTab", () => {
  it("renders the URL input and buttons", () => {
    const onCancel = vi.fn();
    const onSubmit = vi.fn();

    render(<ConnectTab onCancel={onCancel} onSubmit={onSubmit} initialUrl="" />);

    expect(screen.getByLabelText(/marble api url/i)).toBeInTheDocument();
    expect(screen.getByText(/abort/i)).toBeInTheDocument();
    expect(screen.getByText(/engage/i)).toBeInTheDocument();
  });

  it("calls onCancel when Abort is clicked", () => {
    const onCancel = vi.fn();
    const onSubmit = vi.fn();

    render(<ConnectTab onCancel={onCancel} onSubmit={onSubmit} initialUrl="" />);

    fireEvent.click(screen.getByText(/abort/i));
    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onSubmit with url when Engage is clicked", () => {
    const onCancel = vi.fn();
    const onSubmit = vi.fn();

    render(<ConnectTab onCancel={onCancel} onSubmit={onSubmit} initialUrl="" />);

    const input = screen.getByLabelText(/marble api url/i);
    fireEvent.change(input, { target: { value: "https://example.com" } });
    
    fireEvent.click(screen.getByText(/engage/i));
    expect(onSubmit).toHaveBeenCalledWith("https://example.com");
  });
});
