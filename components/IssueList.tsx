"use client";

import { useState } from "react";
import type { AxeIssue } from "@/lib/scanner";
import { getIssueCopy } from "@/lib/issue-copy";

const IMPACT_LABELS: Record<NonNullable<AxeIssue["impact"]>, string> = {
  critical: "Kritisk",
  serious: "Allvarlig",
  moderate: "Måttlig",
  minor: "Mindre",
};
const IMPACT_ORDER: Array<NonNullable<AxeIssue["impact"]>> = [
  "critical",
  "serious",
  "moderate",
  "minor",
];

export function IssueList({ issues }: { issues: AxeIssue[] }) {
  // Group by impact then sort by canonical order
  const grouped = IMPACT_ORDER.map((impact) => ({
    impact,
    issues: issues.filter((i) => i.impact === impact),
  })).filter((g) => g.issues.length > 0);

  return (
    <div className="space-y-12">
      {grouped.map((group) => (
        <div key={group.impact}>
          <h3 className="font-display text-2xl font-medium mb-4 pb-2 border-b border-line">
            {IMPACT_LABELS[group.impact]}{" "}
            <span className="text-ink-mute font-normal italic text-base">
              — {group.issues.length}{" "}
              {group.issues.length === 1 ? "problem" : "problem"}
            </span>
          </h3>
          <div className="space-y-3">
            {group.issues.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function IssueRow({ issue }: { issue: AxeIssue }) {
  const [open, setOpen] = useState(false);
  const copy = getIssueCopy(issue.id);
  const title = copy?.title ?? issue.help;

  return (
    <details
      className="bg-paper border border-line rounded group"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer px-5 py-4 list-none flex items-start justify-between gap-4 hover:bg-cream/40">
        <div>
          <div className="font-semibold text-ink mb-1">{title}</div>
          <div className="text-sm text-ink-soft">
            {issue.nodes.length}{" "}
            {issue.nodes.length === 1 ? "förekomst" : "förekomster"} på sidan
          </div>
        </div>
        <span className="text-ink-mute group-open:rotate-180 transition-transform shrink-0 mt-1">
          ⌄
        </span>
      </summary>
      <div className="border-t border-line px-5 py-4 space-y-5">
        {copy ? (
          <>
            <div>
              <div className="text-xs uppercase tracking-[0.1em] text-ink-mute font-mono font-semibold mb-2">
                — Vad betyder detta?
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">{copy.plain}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.1em] text-ink-mute font-mono font-semibold mb-2">
                — Vem påverkas?
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">{copy.why}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.1em] text-ink-mute font-mono font-semibold mb-2">
                — Så åtgärdar du
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">{copy.fix}</p>
            </div>
          </>
        ) : (
          <div>
            <div className="text-xs uppercase tracking-[0.1em] text-ink-mute font-mono font-semibold mb-2">
              — Beskrivning
            </div>
            <p className="text-sm text-ink-soft leading-relaxed">{issue.description}</p>
            <p className="text-xs text-ink-mute italic mt-2">
              (Engelsk beskrivning från axe-core — svensk text saknas ännu för denna regel.)
            </p>
          </div>
        )}

        <div>
          <div className="text-xs uppercase tracking-[0.1em] text-ink-mute font-mono font-semibold mb-2">
            — WCAG-taggar
          </div>
          <div className="flex flex-wrap gap-2">
            {issue.tags
              .filter((t) => t.startsWith("wcag"))
              .map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded-full bg-cream-2 text-ink-soft font-mono"
                >
                  {t}
                </span>
              ))}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.1em] text-ink-mute font-mono font-semibold mb-2">
            — Exempel på berörda element
          </div>
          <ul className="space-y-2">
            {issue.nodes.slice(0, 3).map((node, idx) => (
              <li key={idx} className="bg-cream border border-line rounded p-3">
                <code className="text-xs font-mono text-ink break-all block whitespace-pre-wrap">
                  {node.html}
                </code>
              </li>
            ))}
          </ul>
          {issue.nodes.length > 3 && (
            <p className="text-xs text-ink-mute mt-2 italic">
              + {issue.nodes.length - 3} fler i den fullständiga rapporten
            </p>
          )}
        </div>

        <a
          href={issue.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block py-2 text-sm text-terracotta hover:text-ink underline"
        >
          Teknisk dokumentation hos Deque →
        </a>
      </div>
    </details>
  );
}
