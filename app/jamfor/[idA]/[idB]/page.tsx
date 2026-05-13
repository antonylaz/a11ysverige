import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getScan } from "@/lib/kv";
import { scoreTier, type ScoreTier } from "@/lib/score";
import type { ScanResult } from "@/lib/scanner";

export const metadata: Metadata = {
  title: "Jämförelse — A11ySverige",
  robots: { index: false, follow: false },
};

const TIER_TEXT: Record<ScoreTier, string> = {
  good: "text-green-leaf",
  ok: "text-gold",
  bad: "text-red-warn",
};

const TIER_LABEL: Record<ScoreTier, string> = {
  good: "God tillgänglighet",
  ok: "Behöver förbättringar",
  bad: "Allvarliga problem",
};

export default async function CompareResultPage({
  params,
}: {
  params: Promise<{ idA: string; idB: string }>;
}) {
  const { idA, idB } = await params;
  const [a, b] = await Promise.all([getScan(idA), getScan(idB)]);
  if (!a || !b) notFound();

  const winner =
    a.score === b.score ? "tie" : a.score > b.score ? "a" : "b";
  const diff = Math.abs(a.score - b.score);

  return (
    <main className="min-h-screen">
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-xl italic font-semibold text-forest"
          >
            a11ysverige
            <span className="text-terracotta not-italic font-bold">.</span>
          </Link>
          <Link
            href="/jamfor"
            className="inline-block py-3 -my-3 text-xs uppercase tracking-[0.1em] font-semibold text-ink-soft hover:text-terracotta"
          >
            ← Jämför andra sidor
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="text-xs uppercase tracking-[0.2em] text-ink-mute font-mono mb-3 text-center">
          — Jämförelse
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tightest text-center mb-3">
          {winner === "tie" ? (
            <>Oavgjort på {a.score}/100</>
          ) : (
            <>
              <span className={`italic font-normal ${winner === "a" ? "text-forest" : "text-terracotta"}`}>
                {hostnameOf((winner === "a" ? a : b).url)}
              </span>{" "}
              leder med {diff} poäng
            </>
          )}
        </h1>
        <p className="text-center text-ink-soft mb-12">
          Båda skannade som {a.device === "mobile" ? "mobil" : "dator"} mot WCAG 2.1 AA.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <CompareCard
            id={idA}
            scan={a}
            winner={winner === "a"}
            loser={winner === "b"}
          />
          <CompareCard
            id={idB}
            scan={b}
            winner={winner === "b"}
            loser={winner === "a"}
          />
        </div>

        <DiffTable a={a} b={b} />

        <div className="mt-12 text-center">
          <Link
            href="/jamfor"
            className="inline-block px-8 py-4 bg-terracotta text-cream font-semibold text-sm uppercase tracking-[0.1em] rounded hover:bg-ink transition"
          >
            Jämför två nya sidor
          </Link>
        </div>
      </div>
    </main>
  );
}

function CompareCard({
  id,
  scan,
  winner,
  loser,
}: {
  id: string;
  scan: ScanResult;
  winner: boolean;
  loser: boolean;
}) {
  const tier = scoreTier(scan.score);
  const accent = winner
    ? "border-forest"
    : loser
      ? "border-terracotta/60"
      : "border-line";

  return (
    <div className={`bg-paper border-2 ${accent} rounded p-6 md:p-8 relative`}>
      {winner && (
        <span className="absolute -top-3 left-6 bg-forest text-cream font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded">
          Vinnare
        </span>
      )}
      <div className="text-[10px] uppercase tracking-[0.2em] text-ink-mute font-mono mb-2">
        — Skannad
      </div>
      <div className="font-display text-xl break-all mb-2">
        {hostnameOf(scan.url)}
      </div>
      {scan.pageTitle && (
        <p className="text-sm text-ink-soft italic mb-6">{scan.pageTitle}</p>
      )}

      <div className="flex items-baseline gap-3 mb-1">
        <span
          className={`font-display font-medium text-7xl md:text-8xl leading-none tracking-tightest ${TIER_TEXT[tier]}`}
        >
          {scan.score}
        </span>
        <span className="font-display text-2xl text-ink-mute">/ 100</span>
      </div>
      <div className={`font-display italic text-lg ${TIER_TEXT[tier]} mb-6`}>
        {TIER_LABEL[tier]}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SeverityChip label="Kritiska" count={scan.byImpact.critical} tone="critical" />
        <SeverityChip label="Allvarliga" count={scan.byImpact.serious} tone="serious" />
        <SeverityChip label="Måttliga" count={scan.byImpact.moderate} tone="moderate" />
        <SeverityChip label="Mindre" count={scan.byImpact.minor} tone="minor" />
      </div>

      <Link
        href={`/scan/${id}`}
        className="mt-6 inline-block text-sm uppercase tracking-[0.1em] font-mono font-semibold text-terracotta hover:text-ink"
      >
        Full rapport →
      </Link>
    </div>
  );
}

function SeverityChip({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "critical" | "serious" | "moderate" | "minor";
}) {
  const dot = {
    critical: "bg-red-warn",
    serious: "bg-terracotta",
    moderate: "bg-gold",
    minor: "bg-ink-mute",
  }[tone];
  return (
    <div className="bg-cream border border-line rounded p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-[10px] uppercase tracking-[0.1em] text-ink-soft font-semibold">
          {label}
        </span>
      </div>
      <div className="font-display text-2xl font-medium">{count}</div>
    </div>
  );
}

function DiffTable({ a, b }: { a: ScanResult; b: ScanResult }) {
  const rows: Array<{ label: string; aVal: number; bVal: number }> = [
    { label: "Totalt antal problem", aVal: a.totalIssues, bVal: b.totalIssues },
    { label: "Kritiska", aVal: a.byImpact.critical, bVal: b.byImpact.critical },
    { label: "Allvarliga", aVal: a.byImpact.serious, bVal: b.byImpact.serious },
    { label: "Måttliga", aVal: a.byImpact.moderate, bVal: b.byImpact.moderate },
    { label: "Mindre", aVal: a.byImpact.minor, bVal: b.byImpact.minor },
  ];

  return (
    <div className="mt-12 bg-paper border border-line rounded p-6 md:p-8">
      <div className="text-xs uppercase tracking-[0.15em] text-ink-mute font-mono mb-4">
        — Skillnader
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="py-3 pr-4 font-mono text-xs uppercase tracking-[0.1em] text-ink-mute font-semibold">
                Mått
              </th>
              <th className="py-3 px-4 text-right font-mono text-xs uppercase tracking-[0.1em] text-ink-mute font-semibold">
                {hostnameOf(a.url)}
              </th>
              <th className="py-3 px-4 text-right font-mono text-xs uppercase tracking-[0.1em] text-ink-mute font-semibold">
                {hostnameOf(b.url)}
              </th>
              <th className="py-3 pl-4 text-right font-mono text-xs uppercase tracking-[0.1em] text-ink-mute font-semibold">
                Skillnad
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const delta = r.aVal - r.bVal;
              const better = delta < 0 ? "a" : delta > 0 ? "b" : null;
              return (
                <tr key={r.label} className="border-b border-line/60">
                  <td className="py-3 pr-4">{r.label}</td>
                  <td
                    className={`py-3 px-4 text-right font-mono ${better === "a" ? "text-forest font-semibold" : ""}`}
                  >
                    {r.aVal}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-mono ${better === "b" ? "text-forest font-semibold" : ""}`}
                  >
                    {r.bVal}
                  </td>
                  <td className="py-3 pl-4 text-right font-mono text-ink-soft">
                    {delta === 0 ? "—" : delta > 0 ? `+${delta}` : delta}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
