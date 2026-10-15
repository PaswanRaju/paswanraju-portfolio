import { ImageResponse } from "next/og";

// Browser-tab icon, generated at build time: a violet tile with the initial R.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "#6b5b95", borderRadius: 7, color: "#ffffff", display: "flex", fontSize: 23, fontWeight: 800, height: "100%", justifyContent: "center", width: "100%" }}>R</div>,
    { ...size },
  );
}
