/**
 * Component render test for the SeverityBadge pill used across the UI.
 */
import { render, screen } from "@testing-library/react";
import { SeverityBadge } from "@/components/ui/SeverityBadge";

describe("SeverityBadge", () => {
  it("renders the severity label text", () => {
    render(<SeverityBadge severity="CRITICAL" />);
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
  });

  it("applies the alert-red styling class for CRITICAL", () => {
    render(<SeverityBadge severity="CRITICAL" />);
    const el = screen.getByText("CRITICAL");
    expect(el.className).toContain("text-secondary-container");
  });

  it("merges a custom className", () => {
    render(<SeverityBadge severity="LOW" className="custom-test-class" />);
    expect(screen.getByText("LOW").className).toContain("custom-test-class");
  });
});
