import { BRAND } from "@/data/site";

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

export function Wordmark({ light = false, size = 40 }: { light?: boolean; size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <LogoMark size={size} color={light ? "#fff" : BRAND.navy} />
      <div style={{ lineHeight: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: size * 0.5, color: BRAND.sky, letterSpacing: "-0.5px" }}>CLONE</span>
          <span style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: size * 0.5, color: light ? "#fff" : BRAND.navy, letterSpacing: "-0.5px" }}>HUB</span>
        </div>
        <div style={{ fontSize: size * 0.16, letterSpacing: "2px", fontWeight: 600, color: light ? "rgba(255,255,255,.65)" : BRAND.sky, marginTop: 2 }}>
          DESIGN · PRINTING · BRANDING
        </div>
      </div>
    </div>
  );
}
