// @vitest-environment happy-dom
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { ManageTab } from "./ManageTab";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});

describe("ManageTab", () => {
  it("renders delete button", () => {
    const onDelete = vi.fn();
    render(<ManageTab onDelete={onDelete} />);

    expect(screen.getByText(/delete portal/i)).toBeInTheDocument();
  });

  it("shows confirmation when delete is clicked", () => {
    const onDelete = vi.fn();
    render(<ManageTab onDelete={onDelete} />);

    fireEvent.click(screen.getByText(/delete portal/i));

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByText(/yes/i)).toBeInTheDocument();
    expect(screen.getByText(/no/i)).toBeInTheDocument();
  });

  it("calls onDelete when confirmed", () => {
    const onDelete = vi.fn();
    render(<ManageTab onDelete={onDelete} />);

    fireEvent.click(screen.getByText(/delete portal/i));
    fireEvent.click(screen.getByText(/yes/i));

    expect(onDelete).toHaveBeenCalled();
  });

  it("cancels deletion when No is clicked", () => {
    const onDelete = vi.fn();
    render(<ManageTab onDelete={onDelete} />);

    fireEvent.click(screen.getByText(/delete portal/i));
    fireEvent.click(screen.getByText(/no/i));

    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
  });
});
