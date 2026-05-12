"use client";

import { useState } from "react";
import type { AxeIssue } from "@/lib/scanner";

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
  return (
    <details
      className="bg-paper border border-line rounded group"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer px-5 py-4 list-none flex items-start justify-between gap-4 hover:bg-cream/40">
        <div>
          <div className="font-semibold text-ink mb-1">{issue.help}</div>
          <div className="text-sm text-ink-soft">
            {issue.nodes.length}{" "}
            {issue.nodes.length === 1 ? "förekomst" : "förekomster"} på sidan
          </div>
        </div>
        <span className="text-ink-mute group-open:rotate-180 transition-transform shrink-0 mt-1">
          ⌄
        </span>
      </summary>
      <div className="border-t border-line px-5 py-4 space-y-4">
        <p className="text-sm text-ink-soft">{issue.description}</p>

        <div>
          <div className="text-xs uppercase tracking-[0.1em] text-ink-mute font-semibold mb-2">
            WCAG-taggar
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
          <div className="text-xs uppercase tracking-[0.1em] text-ink-mute font-semibold mb-2">
            Exempel på berörda element
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
          className="inline-block text-sm text-terracotta hover:text-ink underline"
        >
          Läs mer hos Deque →
        </a>
      </div>
    </details>
  );
}
