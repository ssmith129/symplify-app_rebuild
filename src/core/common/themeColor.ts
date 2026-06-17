// Resolve a CSS custom property (design token) to a concrete string value.
// Charting libraries (ApexCharts/Chart.js) render to canvas/SVG and cannot
// consume `var(--token)` directly, so they need the computed value at runtime.
export function getThemeColor(token: string, fallback = ""): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  return value || fallback;
}
