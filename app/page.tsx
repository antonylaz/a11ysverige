import { ScanForm } from "@/components/ScanForm";
import { getStats, type ScanStats } from "@/lib/stats";

// Always render fresh — the live counter would be misleading if cached.
export const dynamic = "force-dynamic";

export default async function Home() {
  const stats = await getStats().catch((): ScanStats => ({
    total: 0,
    week: 0,
    lastAt: null,
  }));
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-32 md:pb-24 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="w-8 h-px bg-terracotta" />
          <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-mono">
            Tillgänglighetsskanner · Gratis
          </span>
          <span className="w-8 h-px bg-terracotta" />
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tightest mb-8 max-w-4xl mx-auto">
          Är din webbplats{" "}
          <em className="text-forest font-normal">tillgänglig</em> för{" "}
          <span className="italic text-terracotta font-normal">alla</span>?
        </h1>

        <p className="text-lg md:text-xl text-ink-soft max-w-2xl mx-auto leading-relaxed mb-12">
          Skanna din sajt och se var du står mot WCAG 2.1 AA och EU:s
          tillgänglighetsdirektiv (EAA). Gratis, på sekunder, på svenska.
        </p>

        <div className="flex justify-center">
          <ScanForm />
        </div>

        <p className="mt-6 text-sm text-ink-mute">
          Inga konton. Ingen kreditkortsuppgift. Resultatet på 20 sekunder.
        </p>
      </section>

      {/* Live scan counter */}
      <ScanCounter stats={stats} />

      {/* Report preview */}
      <ReportPreview />

      {/* How it works */}
      <section className="border-t border-line bg-paper">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-mute font-mono mb-3">
            — Så fungerar det
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tightest mb-16 max-w-3xl">
            Tre steg. Ingen krångel.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Step
              num="01"
              title="Skanna"
              body="Klistra in din webbplatsadress. Vi renderar sidan, kör WCAG 2.1 AA-tester och en uppsättning extra kontroller."
            />
            <Step
              num="02"
              title="Förstå"
              body="Få en tydlig poäng från 0 till 100, en lista över problem och en förklaring av vad varje fel betyder för dina användare."
            />
            <Step
              num="03"
              title="Åtgärda"
              body="Ladda ner en fullständig PDF-rapport. Skicka den till din utvecklare eller använd den som underlag för en tillgänglighetsredogörelse."
            />
          </div>
        </div>
      </section>

      {/* EAA context */}
      <section className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-ink-mute font-mono mb-3">
            — Varför nu
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tightest mb-8 max-w-3xl">
            EAA är <em className="text-forest font-normal">lag</em> sedan 28 juni 2025.
          </h2>
          <p className="text-lg text-ink-soft max-w-3xl leading-relaxed">
            European Accessibility Act omfattar nu alla företag med fler än
            tio anställda som säljer digitalt till konsumenter — e-handel,
            bank, transport, telekom, e-böcker. Offentlig sektor är skyldig
            sedan 2019. Påföljder börjar med förelägganden och vite från
            PTS och DIGG.
          </p>
        </div>
      </section>

      <footer className="border-t border-line bg-ink text-cream">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="font-display text-xl italic font-semibold mb-2">
              a11ysverige<span className="text-terracotta not-italic font-bold">.</span>
            </div>
            <p className="text-cream/70">
              Tillgänglighet på autopilot. Byggt i Stockholm.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-gold mb-3">
              Mer
            </h4>
            <ul className="space-y-1 text-cream/85">
              <li><a href="/integritetspolicy" className="inline-block py-2 -my-1 hover:text-cream">Integritetspolicy</a></li>
              <li><a href="/cookies" className="inline-block py-2 -my-1 hover:text-cream">Cookies</a></li>
              <li><a href="/kontakt" className="inline-block py-2 -my-1 hover:text-cream">Kontakt</a></li>
            </ul>
          </div>
          <div className="text-cream/60 text-xs">
            © {new Date().getFullYear()} A11ySverige
          </div>
        </div>
      </footer>
    </main>
  );
}

function ScanCounter({ stats }: { stats: ScanStats }) {
  const hasAnyScans = stats.total > 0;
  return (
    <section className="border-t border-b border-line bg-cream-2/40">
      <div className="max-w-6xl mx-auto px-6 py-5 text-center">
        <p className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] md:text-xs uppercase tracking-[0.15em] text-ink-soft">
          <span className="inline-flex items-center gap-2">
            <span className="relative inline-block w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-green-leaf" />
              <span className="absolute inset-0 rounded-full bg-green-leaf animate-ping opacity-60" />
            </span>
            {hasAnyScans ? (
              <>
                <strong className="text-ink font-bold">
                  {stats.total.toLocaleString("sv-SE")}
                </strong>{" "}
                skanningar totalt
              </>
            ) : (
              <span>Var den första att skanna en sajt</span>
            )}
          </span>
          {stats.week > 0 && (
            <>
              <span className="text-ink-mute" aria-hidden>·</span>
              <span>
                <strong className="text-ink font-bold">{stats.week}</strong>{" "}
                denna vecka
              </span>
            </>
          )}
          {stats.lastAt && (
            <>
              <span className="text-ink-mute" aria-hidden>·</span>
              <span>senast {formatRelative(stats.lastAt)}</span>
            </>
          )}
        </p>
      </div>
    </section>
  );
}

function formatRelative(ms: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (diffSec < 60) return `${diffSec}s sedan`;
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min} min sedan`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h sedan`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d sedan`;
  return new Date(ms).toLocaleDateString("sv-SE");
}

function Step({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="border-t-2 border-ink pt-6">
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink-mute mb-3">
        — {num}
      </div>
      <h3 className="font-display text-2xl font-medium mb-3">{title}</h3>
      <p className="text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

// ---------- Report preview (inline mock, kept in sync with design tokens) ----------

function ReportPreview() {
  return (
    <section className="border-t border-line bg-paper">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-ink-mute font-mono mb-3 text-center">
          — Så ser rapporten ut
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tightest mb-4 max-w-3xl mx-auto text-center">
          Konkreta problem. Tydlig prioritering.{" "}
          <em className="italic text-forest font-normal">På svenska.</em>
        </h2>
        <p className="text-ink-soft max-w-2xl mx-auto text-center mb-12 leading-relaxed">
          Varje problem förklaras för en utvecklare och en chef — vad det är,
          vem det påverkar och hur du åtgärdar det. Med WCAG-referenser och
          poäng som mäter framsteg.
        </p>

        {/* Mock report card */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -top-3 left-6 z-10 bg-terracotta text-cream font-mono text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded">
            Förhandsvisning
          </div>

          <div className="bg-cream border border-line rounded-lg p-6 md:p-10 shadow-[0_20px_60px_-20px_rgba(26,31,26,0.25)]">
            {/* URL */}
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-mute font-mono mb-2">
              — Resultat för
            </div>
            <div className="font-display text-lg md:text-xl break-all mb-1">
              https://dinwebbplats.se
            </div>
            <div className="text-sm text-ink-soft mb-6 italic">
              Välkommen — Din Webbplats
            </div>

            {/* Score block */}
            <div className="grid md:grid-cols-2 gap-6 items-center bg-paper border border-line rounded p-6 mb-8">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-ink-mute font-mono mb-2">
                  — Tillgänglighetspoäng
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-medium text-7xl md:text-8xl leading-none tracking-tightest text-gold">
                    67
                  </span>
                  <span className="font-display text-2xl text-ink-mute">
                    / 100
                  </span>
                </div>
                <div className="mt-2 font-display italic text-lg text-gold">
                  Behöver förbättringar
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <PreviewSeverity label="Kritiska" count={2} tone="critical" />
                <PreviewSeverity label="Allvarliga" count={5} tone="serious" />
                <PreviewSeverity label="Måttliga" count={8} tone="moderate" />
                <PreviewSeverity label="Mindre" count={3} tone="minor" />
              </div>
            </div>

            {/* Example issues with severity bars (the same bars now used live) */}
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-mute font-mono mb-3">
              — Problemexempel
            </div>
            <div className="space-y-2">
              <PreviewIssue
                impact="critical"
                title="Otillräcklig kontrast mellan text och bakgrund"
                count={4}
              />
              <PreviewIssue
                impact="serious"
                title="Bild saknar alt-text"
                count={11}
              />
              <PreviewIssue
                impact="moderate"
                title="Sidan saknar <main>-landmark"
                count={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const PREVIEW_TONES = {
  critical: { dot: "bg-red-warn", border: "border-l-red-warn" },
  serious: { dot: "bg-terracotta", border: "border-l-terracotta" },
  moderate: { dot: "bg-gold", border: "border-l-gold" },
  minor: { dot: "bg-ink-mute", border: "border-l-ink-mute" },
} as const;

function PreviewSeverity({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: keyof typeof PREVIEW_TONES;
}) {
  return (
    <div className="bg-cream border border-line rounded p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${PREVIEW_TONES[tone].dot}`} />
        <span className="text-[10px] uppercase tracking-[0.1em] text-ink-soft font-semibold">
          {label}
        </span>
      </div>
      <div className="font-display text-2xl font-medium">{count}</div>
    </div>
  );
}

function PreviewIssue({
  impact,
  title,
  count,
}: {
  impact: keyof typeof PREVIEW_TONES;
  title: string;
  count: number;
}) {
  return (
    <div
      className={`bg-paper border border-line border-l-4 ${PREVIEW_TONES[impact].border} rounded px-4 py-3 flex items-start justify-between gap-4`}
    >
      <div>
        <div className="font-semibold text-ink text-sm">{title}</div>
        <div className="text-xs text-ink-soft mt-0.5">
          {count} {count === 1 ? "förekomst" : "förekomster"} på sidan
        </div>
      </div>
      <span className="text-ink-mute shrink-0 mt-1">⌄</span>
    </div>
  );
}
