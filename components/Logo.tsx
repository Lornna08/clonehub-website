import { BRAND } from "@/data/site";

/* SVG mark — used for faint watermarks on placeholder tiles only. */
export function LogoMark({ size = 40, color = BRAND.navy }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="63" cy="58" r="24" stroke={color} strokeWidth="8" />
      <circle cx="63" cy="58" r="9" fill={color} />
      <circle cx="26" cy="40" r="12" fill={color} />
      <circle cx="26" cy="76" r="12" fill={color} />
      <circle cx="63" cy="18" r="12" fill={color} />
      <line x1="34" y1="45" x2="47" y2="53" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <line x1="34" y1="71" x2="47" y2="63" stroke={color} strokeWidth="7" strokeLinecap="round" />
      <line x1="63" y1="30" x2="63" y2="34" stroke={color} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

/* Real Clone Hub logo image. `light` = on a dark background → sits on a white chip. */
export function Wordmark({ light = false, size = 40 }: { light?: boolean; size?: number }) {
  const h = size * 1.15;
  const img = (
    <img
      src="/logo.png"
      alt="Clone Hub — Design, Printing and Branding"
      style={{ height: h, width: "auto", display: "block" }}
    />
  );
  if (light) {
    return (
      <span style={{ display: "inline-flex", background: "#fff", padding: "8px 12px", borderRadius: 12 }}>
        {img}
      </span>
    );
  }
  return img;
}
