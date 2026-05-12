"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function EmailGate({ scanId }: { scanId: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    try {
      const res = await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId, email, consent }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Kunde inte skicka rapporten.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Något gick fel.");
    }
  }

  if (status === "success") {
    return (
      <div className="mt-20 bg-ink text-cream rounded p-8 md:p-12">
        <div className="text-xs uppercase tracking-[0.2em] text-gold font-mono mb-3">
          — Skickat
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tightest mb-4 max-w-2xl">
          Klart! <em className="italic text-gold font-normal">Kolla din inkorg.</em>
        </h2>
        <p className="text-cream/85 max-w-2xl">
          Vi har skickat den fullständiga PDF-rapporten till <strong>{email}</strong>.
          Hittar du den inte? Kolla skräpposten — annars hör av dig på{" "}
          <a className="underline text-gold" href="mailto:hej@a11ysverige.se">hej@a11ysverige.se</a>.
        </p>
        <p className="text-xs text-cream/60 mt-6">
          Du kan också ladda ner PDF:en direkt:{" "}
          <a className="underline" href={`/api/pdf/${scanId}`} target="_blank" rel="noreferrer">
            /api/pdf/{scanId}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-20 bg-ink text-cream rounded p-8 md:p-12">
      <div className="text-xs uppercase tracking-[0.2em] text-gold font-mono mb-3">
        — Få den fullständiga rapporten
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tightest mb-6 max-w-2xl">
        Ladda ner som <em className="italic text-gold font-normal">PDF</em>{" "}
        och dela med ditt team.
      </h2>
      <p className="text-cream/85 mb-8 max-w-2xl">
        Rapporten innehåller varje problem, hur det påverkar användare och
        hänvisningar till WCAG-kriterierna — färdig att skicka till din
        utvecklare.
      </p>

      <div className="grid sm:grid-cols-[1fr_auto] gap-3 max-w-2xl">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          placeholder="namn@företag.se"
          aria-label="Din e-postadress"
          className="px-5 py-4 bg-cream text-ink border border-line rounded text-base focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "submitting" || !consent || email.length < 3}
          className="px-8 py-4 bg-terracotta text-cream font-semibold text-sm uppercase tracking-[0.1em] rounded hover:bg-gold hover:text-ink transition disabled:bg-ink-mute disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Skickar..." : "Skicka rapporten"}
        </button>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-cream/85 max-w-2xl cursor-pointer py-2 -my-2">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={status === "submitting"}
          className="mt-1 h-5 w-5 accent-terracotta shrink-0"
        />
        <span>
          Jag godkänner att A11ySverige sparar min e-postadress för att leverera
          rapporten och eventuella uppföljningar. Se{" "}
          <a href="/integritetspolicy" className="underline text-gold">integritetspolicyn</a>.
        </span>
      </label>

      {error && (
        <p className="mt-4 text-sm text-red-warn bg-cream/10 border border-red-warn/40 rounded px-4 py-3" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
