/**
 * Unit tests for the central severity → style mapping.
 * This is the single source of truth every badge and chart reads from.
 */
import { severityStyle } from "@/lib/severity";

describe("severityStyle", () => {
  it("returns distinct styling for each known severity", () => {
    for (const level of ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]) {
      const style = severityStyle(level);
      expect(style.badge).toBeTruthy();
      expect(style.text).toBeTruthy();
      expect(style.hex).toMatch(/^#/);
    }
  });

  it("is case-insensitive", () => {
    expect(severityStyle("critical")).toEqual(severityStyle("CRITICAL"));
    expect(severityStyle("High")).toEqual(severityStyle("HIGH"));
  });

  it("falls back to the default style for unknown or empty severities", () => {
    const fallback = severityStyle("INFO");
    expect(severityStyle("NONSENSE")).toEqual(fallback);
    expect(severityStyle("")).toEqual(fallback);
    expect(severityStyle(null)).toEqual(fallback);
    expect(severityStyle(undefined)).toEqual(fallback);
  });

  it("maps CRITICAL and HIGH to the same alert-red hex", () => {
    expect(severityStyle("CRITICAL").hex).toBe(severityStyle("HIGH").hex);
    expect(severityStyle("CRITICAL").hex).toBe("#ff506e");
  });
});
