import { ImageResponse } from "next/og";
import { getScan } from "@/lib/kv";

export const runtime = "nodejs";
export const alt = "Tillgänglighetsrapport — A11ySverige";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: { id: string };
}) {
  const scan = await getScan(params.id);

  if (!scan) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "#f5f1e8",
            color: "#1a1f1a",
            fontFamily: "Georgia, serif",
            fontSize: 80,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ fontStyle: "italic", fontWeight: 600 }}>
            a11ysverige
          </span>
          <span style={{ color: "#c5552d", fontWeight: 700 }}>.</span>
        </div>
      ),
      { ...size },
    );
  }

  const tier =
    scan.score >= 80 ? "good" : scan.score >= 50 ? "ok" : "bad";
  const tierColor =
    tier === "good" ? "#6b8e5a" : tier === "ok" ? "#d4a056" : "#b04545";
  const tierLabel =
    tier === "good"
      ? "God tillgänglighet"
      : tier === "ok"
        ? "Behöver förbättringar"
        : "Allvarliga problem";

  let hostname = scan.url;
  try {
    hostname = new URL(scan.url).hostname;
  } catch {
    // keep original
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#f5f1e8",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top row: wordmark + eyebrow */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#1f3a2e",
              fontStyle: "italic",
              fontWeight: 600,
            }}
          >
            a11ysverige
            <span style={{ color: "#c5552d", fontStyle: "normal", fontWeight: 700 }}>
              .
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: "#8a8f86",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Tillgänglighetsrapport · WCAG 2.1 AA
          </div>
        </div>

        {/* Big score */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginTop: 64,
            gap: 16,
          }}
        >
          <span
            style={{
              fontSize: 280,
              lineHeight: 1,
              color: tierColor,
              fontWeight: 500,
              letterSpacing: "-0.04em",
            }}
          >
            {scan.score}
          </span>
          <span style={{ fontSize: 60, color: "#8a8f86" }}>/ 100</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 42,
            fontStyle: "italic",
            color: tierColor,
            marginTop: 4,
          }}
        >
          {tierLabel}
        </div>

        {/* Scanned URL */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "#8a8f86",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Skannad
          </div>
          <div style={{ fontSize: 36, color: "#1a1f1a", marginTop: 4 }}>
            {hostname}
          </div>
        </div>

        {/* Severity strip */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: "auto",
          }}
        >
          <SeverityChip
            label="Kritiska"
            count={scan.byImpact.critical}
            color="#b04545"
          />
          <SeverityChip
            label="Allvarliga"
            count={scan.byImpact.serious}
            color="#c5552d"
          />
          <SeverityChip
            label="Måttliga"
            count={scan.byImpact.moderate}
            color="#d4a056"
          />
          <SeverityChip
            label="Mindre"
            count={scan.byImpact.minor}
            color="#8a8f86"
          />
        </div>
      </div>
    ),
    { ...size },
  );
}

function SeverityChip({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "16px 24px",
        border: "1px solid #d8d2c0",
        borderRadius: 8,
        background: "#faf7ef",
        flexGrow: 1,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 14,
          color: "#4a544a",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 44,
          color: "#1a1f1a",
          fontWeight: 500,
          marginTop: 4,
        }}
      >
        {count}
      </div>
    </div>
  );
}
