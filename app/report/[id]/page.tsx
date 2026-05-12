import { notFound } from "next/navigation";
import { getScan } from "@/lib/kv";
import { scoreTier } from "@/lib/score";
import { getIssueCopy } from "@/lib/issue-copy";
import type { AxeIssue } from "@/lib/scanner";

export const dynamic = "force-dynamic";

const IMPACT_LABELS = {
  critical: "Kritisk",
  serious: "Allvarlig",
  moderate: "Måttlig",
  minor: "Mindre",
} as const;

const IMPACT_ORDER: Array<NonNullable<AxeIssue["impact"]>> = [
  "critical",
  "serious",
  "moderate",
  "minor",
];

const TIER_COPY = {
  good: {
    label: "God tillgänglighet",
    description:
      "Sidan klarar de flesta automatiska WCAG 2.1 AA-kontroller. En manuell granskning rekommenderas fortfarande för full täckning.",
  },
  ok: {
    label: "Behöver förbättringar",
    description:
      "Sidan har flera tillgänglighetsproblem som påverkar användarupplevelsen. Prioritera kritiska och allvarliga problem först.",
  },
  bad: {
    label: "Allvarliga problem",
    description:
      "Sidan har omfattande tillgänglighetsproblem som troligen utestänger användare. Omedelbar åtgärd rekommenderas.",
  },
} as const;

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scan = await getScan(id);
  if (!scan) notFound();

  const tier = scoreTier(scan.score);
  const grouped = IMPACT_ORDER.map((impact) => ({
    impact,
    issues: scan.issues.filter((i) => i.impact === impact),
  })).filter((g) => g.issues.length > 0);

  return (
    <main className="report-doc">
      {/* Cover */}
      <section className="report-cover">
        <div className="report-mark">
          a11ysverige<span className="report-mark-dot">.</span>
        </div>
        <div className="report-eyebrow">Tillgänglighetsrapport — WCAG 2.1 AA</div>
        <h1 className="report-title">
          Tillgänglighets&shy;granskning
        </h1>
        <div className="report-url-block">
          <div className="report-meta-label">Skannad webbplats</div>
          <div className="report-url">{scan.url}</div>
          {scan.pageTitle && (
            <div className="report-page-title">{scan.pageTitle}</div>
          )}
        </div>
        <div className="report-meta-grid">
          <div>
            <div className="report-meta-label">Datum</div>
            <div className="report-meta-value">
              {new Date(scan.scannedAt).toLocaleString("sv-SE")}
            </div>
          </div>
          <div>
            <div className="report-meta-label">Enhet</div>
            <div className="report-meta-value">
              {scan.device === "mobile"
                ? "Mobil (iPhone 14)"
                : "Dator (1366×900)"}
            </div>
          </div>
          <div>
            <div className="report-meta-label">Standard</div>
            <div className="report-meta-value">WCAG 2.1 AA</div>
          </div>
          <div>
            <div className="report-meta-label">Skanntid</div>
            <div className="report-meta-value">
              {(scan.durationMs / 1000).toFixed(1)} s
            </div>
          </div>
        </div>
        <div className={`report-score-card score-${tier}`}>
          <div className="report-score-row">
            <div className="report-score-num">{scan.score}</div>
            <div className="report-score-suffix">/ 100</div>
          </div>
          <div className="report-score-label">{TIER_COPY[tier].label}</div>
          <p className="report-score-desc">{TIER_COPY[tier].description}</p>
        </div>
      </section>

      {/* Summary table */}
      <section className="report-section">
        <h2 className="report-h2">Sammanfattning</h2>
        <table className="report-summary-table">
          <thead>
            <tr>
              <th>Allvarlighet</th>
              <th>Antal problem</th>
              <th>Avdrag från poäng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Kritiska</td>
              <td>{scan.byImpact.critical}</td>
              <td>−{scan.byImpact.critical * 5}</td>
            </tr>
            <tr>
              <td>Allvarliga</td>
              <td>{scan.byImpact.serious}</td>
              <td>−{scan.byImpact.serious * 3}</td>
            </tr>
            <tr>
              <td>Måttliga</td>
              <td>{scan.byImpact.moderate}</td>
              <td>−{scan.byImpact.moderate}</td>
            </tr>
            <tr>
              <td>Mindre</td>
              <td>{scan.byImpact.minor}</td>
              <td>−{(scan.byImpact.minor * 0.5).toFixed(1)}</td>
            </tr>
            <tr className="report-total-row">
              <td>Totalt</td>
              <td>{scan.totalIssues}</td>
              <td>{scan.score}/100</td>
            </tr>
          </tbody>
        </table>

        <p className="report-note">
          Notera: automatiska tester fångar uppskattningsvis 30–40 % av alla
          tillgänglighetsproblem. En manuell granskning av tangentbords&shy;navigation,
          skärmläsar&shy;flöde och kognitiv tillgänglighet rekommenderas alltid
          som komplement.
        </p>
      </section>

      {/* Issues */}
      <section className="report-section">
        <h2 className="report-h2">Detaljerade resultat</h2>

        {grouped.length === 0 ? (
          <p className="report-empty">
            Inga WCAG 2.1 AA-problem hittades av de automatiska kontrollerna.
          </p>
        ) : (
          grouped.map((group) => (
            <div key={group.impact} className="report-group">
              <h3 className="report-h3">
                {IMPACT_LABELS[group.impact]} ({group.issues.length})
              </h3>
              {group.issues.map((issue, idx) => {
                const copy = getIssueCopy(issue.id);
                const title = copy?.title ?? issue.help;
                return (
                  <article key={issue.id} className="report-issue">
                    <div className="report-issue-num">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="report-issue-body">
                      <h4 className="report-issue-help">{title}</h4>

                      {copy ? (
                        <div className="report-copy-stack">
                          <div className="report-copy-block">
                            <div className="report-copy-label">Vad betyder detta?</div>
                            <p>{copy.plain}</p>
                          </div>
                          <div className="report-copy-block">
                            <div className="report-copy-label">Vem påverkas?</div>
                            <p>{copy.why}</p>
                          </div>
                          <div className="report-copy-block">
                            <div className="report-copy-label">Så åtgärdar du</div>
                            <p>{copy.fix}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="report-issue-desc">{issue.description}</p>
                          <p className="report-issue-en-note">
                            (Engelsk beskrivning från axe-core — svensk text
                            saknas för denna regel.)
                          </p>
                        </>
                      )}

                      <div className="report-tag-row">
                        {issue.tags
                          .filter((t) => t.startsWith("wcag"))
                          .map((t) => (
                            <span key={t} className="report-tag">
                              {t}
                            </span>
                          ))}
                        <span className="report-tag report-tag-muted">
                          {issue.nodes.length} förekomst
                          {issue.nodes.length === 1 ? "" : "er"}
                        </span>
                      </div>

                      {issue.nodes.slice(0, 2).map((node, nidx) => (
                        <div key={nidx} className="report-node">
                          <div className="report-node-label">
                            Berört element {nidx + 1}
                          </div>
                          <pre className="report-node-html">{node.html}</pre>
                          {node.failureSummary && (
                            <p className="report-node-fail">
                              {node.failureSummary}
                            </p>
                          )}
                        </div>
                      ))}
                      {issue.nodes.length > 2 && (
                        <p className="report-more">
                          + {issue.nodes.length - 2} fler förekomster
                        </p>
                      )}

                      <p className="report-issue-link">
                        Teknisk dokumentation: {issue.helpUrl}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ))
        )}
      </section>

      <footer className="report-footer">
        <div>
          Genererad av <strong>A11ySverige</strong> · a11ysverige.se
        </div>
        <div>
          Mot WCAG 2.1 AA · European Accessibility Act (EAA) gäller från
          28 juni 2025.
        </div>
      </footer>
    </main>
  );
}
