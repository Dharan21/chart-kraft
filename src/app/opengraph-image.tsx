import { ImageResponse } from "next/og";

export const alt = "Chart Craft: turn CSV files into charts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const bars = [220, 320, 180, 400, 280];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#3f524a",
          color: "#f5ecea",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 220 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 56,
                height: h / 2,
                background: i === 3 ? "#e9b44c" : "#9fd3c0",
                borderRadius: 8,
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 32 }}>Chart Craft</div>
        <div style={{ fontSize: 40, opacity: 0.9, marginTop: 8 }}>
          Turn CSV files into charts. Private, in your browser.
        </div>
      </div>
    ),
    size
  );
}
