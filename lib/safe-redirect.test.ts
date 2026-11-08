import { describe, expect, it } from "vitest";
import { safeNextPath } from "./safe-redirect";

describe("safeNextPath", () => {
  it("allows paths inside the site", () => {
    expect(safeNextPath("/reset-password")).toBe("/reset-password");
    expect(safeNextPath("/words/3?x=1")).toBe("/words/3?x=1");
  });

  it("rejects anything that could leave the site", () => {
    for (const bad of ["//evil.com", "https://evil.com", "/\\evil.com", "javascript:alert(1)", "evil.com"]) {
      expect(safeNextPath(bad)).toBe("/");
    }
  });

  it("uses the fallback for empty values", () => {
    expect(safeNextPath(null)).toBe("/");
    expect(safeNextPath("")).toBe("/");
    expect(safeNextPath(undefined, "/home")).toBe("/home");
  });
});
