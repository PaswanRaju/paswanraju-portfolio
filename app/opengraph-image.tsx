import { ImageResponse } from "next/og";
import { personalInfo } from "../data/site";

// Link-preview image (Open Graph), generated at build time in the site's light palette.
export const alt = "Raju Kumar Paswan, Software Developer and Computer Science student at UT Arlington";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: "#f7f7f5", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", padding: "0 96px", width: "100%" }}>
      <div style={{ display: "flex", gap: 14, marginBottom: 40 }}>
        <div style={{ background: "#6b5b95", height: 10, width: 120 }} />
        <div style={{ background: "#ff6f61", height: 10, width: 40 }} />
        <div style={{ background: "#88b04b", height: 10, width: 40 }} />
      </div>
      <div style={{ color: "#111111", display: "flex", fontSize: 88, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05 }}>{personalInfo.name}</div>
      <div style={{ color: "#6b5b95", display: "flex", fontSize: 44, fontWeight: 700, marginTop: 20 }}>Software Developer</div>
      <div style={{ color: "#5a6270", display: "flex", fontSize: 32, marginTop: 28 }}>Computer Science student at UT Arlington</div>
      <div style={{ color: "#5a6270", display: "flex", fontSize: 26, marginTop: 56 }}>paswanraju.com</div>
    </div>,
    { ...size },
  );
}
