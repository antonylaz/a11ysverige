interface Props {
  score: number;
  byImpact: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  totalIssues: number;
}

export function ScoreDisplay({ score, byImpact }: Props) {
  const tier = score >= 80 ? "good" : score >= 50 ? "ok" : "bad";
  const colors = {
    good: "text-green-leaf",
    ok: "text-gold",
    bad: "text-red-warn",
  } as const;
  const labels = {
    good: "God tillgänglighet",
    ok: "Behöver förbättringar",
    bad: "Allvarliga problem",
  } as const;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center bg-paper border border-line rounded p-8 md:p-12">
      {/* Score */}
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-ink-mute font-mono mb-3">
          — Tillgänglighetspoäng
        </div>
        <div className="flex items-baseline gap-3">
          <span
            className={`font-display font-medium text-8xl md:text-9xl leading-none tracking-tightest ${colors[tier]}`}
          >
            {score}
          </span>
          <span className="font-display text-3xl text-ink-mute">/ 100</span>
        </div>
        <div className={`mt-3 font-display italic text-xl ${colors[tier]}`}>
          {labels[tier]}
        </div>
      </div>

      {/* Severity breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <SeverityCard
          label="Kritiska"
          count={byImpact.critical}
          tone="critical"
        />
        <SeverityCard
          label="Allvarliga"
          count={byImpact.serious}
          tone="serious"
        />
        <SeverityCard
          label="Måttliga"
          count={byImpact.moderate}
          tone="moderate"
        />
        <SeverityCard
          label="Mindre"
          count={byImpact.minor}
          tone="minor"
        />
      </div>
    </div>
  );
}

function SeverityCard({
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
    <div className="bg-cream border border-line rounded p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-xs uppercase tracking-[0.1em] text-ink-soft font-semibold">
          {label}
        </span>
      </div>
      <div className="font-display text-3xl font-medium">{count}</div>
    </div>
  );
}
