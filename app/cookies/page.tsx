import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies — A11ySverige",
  description:
    "Information om hur A11ySverige använder cookies och liknande tekniker.",
};

export default function Cookies() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <a href="/" className="text-sm text-ink-soft hover:text-terracotta">
        ← Tillbaka
      </a>
      <h1 className="font-display text-5xl font-medium tracking-tightest mt-8 mb-8">
        Cookies
      </h1>
      <div className="text-ink-soft leading-relaxed space-y-4 text-lg">
        <p>
          A11ySverige använder så få cookies som möjligt. Tjänsten fungerar
          utan att du behöver acceptera spårning och vi sätter inga cookies för
          marknadsföring eller annonsering.
        </p>

        <h2 className="font-display text-2xl font-medium mt-10 mb-2 text-ink">
          Vad vi använder
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Nödvändiga cookies</strong> — endast om du själv har en
            aktiv session (t.ex. för att hindra dubbelinskick på formulär).
          </li>
          <li>
            <strong>Analys via Plausible</strong> — vi använder Plausible,
            som är cookielös och GDPR-vänlig. Inga personuppgifter eller
            IP-adresser sparas hos oss eller hos Plausible.
          </li>
        </ul>

        <h2 className="font-display text-2xl font-medium mt-10 mb-2 text-ink">
          Vad vi inte gör
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Vi använder inte Google Analytics, Facebook Pixel eller liknande.</li>
          <li>Vi delar inte data med annonsnätverk.</li>
          <li>Vi följer inte ditt surfande utanför a11ysverige.se.</li>
        </ul>

        <p className="italic text-ink-mute mt-10">
          (Denna text är ett utkast — uppdateras med juridiskt granskad
          formulering före publik lansering.)
        </p>
      </div>
    </main>
  );
}
