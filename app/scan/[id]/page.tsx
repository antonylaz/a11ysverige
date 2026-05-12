import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getScan } from "@/lib/kv";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { IssueList } from "@/components/IssueList";
import { EmailGate } from "@/components/EmailGate";

export const metadata: Metadata = {
  title: "Skanningsresultat — A11ySverige",
  robots: { index: false, follow: false },
};

export default async function ScanResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scan = await getScan(id);
  if (!scan) notFound();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="font-display text-xl italic font-semibold text-forest">
            a11ysverige<span className="text-terracotta not-italic font-bold">.</span>
          </Link>
          <Link
            href="/"
            className="inline-block py-3 -my-3 text-xs uppercase tracking-[0.1em] font-semibold text-ink-soft hover:text-terracotta"
          >
            ← Skanna en ny sida
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* URL info */}
        <div className="text-xs uppercase tracking-[0.2em] text-ink-mute font-mono mb-3">
          — Resultat för
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tightest mb-2 break-all">
          {scan.url}
        </h1>
        {scan.pageTitle && (
          <p className="text-ink-soft mb-8">{scan.pageTitle}</p>
        )}

        {/* Score */}
        <ScoreDisplay
          score={scan.score}
          byImpact={scan.byImpact}
          totalIssues={scan.totalIssues}
        />

        {/* Issue list */}
        <div className="mt-16">
          <div className="border-b border-line pb-4 mb-8 flex items-baseline justify-between">
            <h2 className="font-display text-3xl font-medium tracking-tight">
              {scan.totalIssues === 0
                ? "Inga problem hittade"
                : `${scan.totalIssues} problem hittade`}
            </h2>
            <span className="font-display italic text-sm text-ink-mute">
              — Skannad {new Date(scan.scannedAt).toLocaleString("sv-SE")}
            </span>
          </div>

          {scan.issues.length === 0 ? (
            <div className="bg-paper border border-line rounded p-8 text-center">
              <div className="text-5xl mb-4">✓</div>
              <p className="font-display text-xl text-forest">
                Snyggt jobbat — vi hittade inga WCAG 2.1 AA-problem på den här sidan.
              </p>
              <p className="text-sm text-ink-mute mt-3">
                Notera: automatiska tester fångar uppskattningsvis 30–40 % av
                tillgänglighetsproblem. En manuell granskning rekommenderas
                fortfarande.
              </p>
            </div>
          ) : (
            <IssueList issues={scan.issues} />
          )}
        </div>

        <EmailGate scanId={id} />
      </div>
    </main>
  );
}
