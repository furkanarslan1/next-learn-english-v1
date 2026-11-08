/**
 * Only allows redirects to a path inside this site (e.g. "/reset-password").
 * Anything else (full URLs, "//evil.com", backslash tricks) falls back to `fallback`.
 */
export function safeNextPath(next: string | null | undefined, fallback = "/") {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}
