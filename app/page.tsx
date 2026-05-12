import { ScanForm } from "@/components/ScanForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="inline-flex items-center gap-3 mb-8">
          <span className="w-8 h-px bg-terracotta" />
          <span className="text-xs uppercase tracking-[0.2em] text-terracotta font-mono">
            Tillgänglighetsskanner · Gratis
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tightest mb-8 max-w-4xl">
          Är din webbplats{" "}
          <em className="text-forest font-normal">tillgänglig</em> för{" "}
          <span className="italic text-terracotta font-normal">alla</span>?
        </h1>

        <p className="text-lg md:text-xl text-ink-soft max-w-2xl leading-relaxed mb-12 border-l-2 border-gold pl-6">
          Skanna din sajt och se var du står mot WCAG 2.1 AA och EU:s
          tillgänglighetsdirektiv (EAA). Gratis, på sekunder, på svenska.
        </p>

        <ScanForm />

        <p className="mt-6 text-sm text-ink-mute">
          Inga konton. Ingen kreditkortsuppgift. Resultatet på 20 sekunder.
        </p>
      </section>

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
