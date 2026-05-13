import Link from "next/link";
import type { Metadata } from "next";
import { CompareForm } from "@/components/CompareForm";

export const metadata: Metadata = {
  title: "Jämför två webbplatser",
  description:
    "Skanna två webbplatser sida vid sida — perfekt för att jämföra din sajt mot en konkurrent eller mot ett tidigare resultat.",
};

export default function ComparePage() {
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
            href="/"
            className="inline-block py-3 -my-3 text-xs uppercase tracking-[0.1em] font-semibold text-ink-soft hover:text-terracotta"
          >
            ← Skanna en sida
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 md:pt-32 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="w-8 h-px bg-terracotta" />
          <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-mono">
            Jämför sida vid sida
          </span>
          <span className="w-8 h-px bg-terracotta" />
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-medium leading-[0.95] tracking-tightest mb-6 max-w-3xl mx-auto">
          Din sajt mot{" "}
          <em className="text-forest font-normal">vem som helst</em>.
        </h1>
        <p className="text-lg text-ink-soft max-w-2xl mx-auto leading-relaxed mb-12">
          Skanna två webbadresser och se vem som har bäst tillgänglighet — och
          vilka problem som skiljer dem åt.
        </p>
        <CompareForm />
        <p className="mt-6 text-sm text-ink-mute">
          Båda skannas i tur och ordning — räkna med 1–2 minuter totalt.
        </p>
      </section>
    </main>
  );
}
