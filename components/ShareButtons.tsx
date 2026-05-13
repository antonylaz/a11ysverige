"use client";

import { useMemo, useState } from "react";

interface Props {
  scanId: string;
  score: number;
  siteUrl: string;
}

export function ShareButtons({ scanId, score, siteUrl }: Props) {
  const cleanBase = siteUrl.replace(/\/$/, "");
  const shareUrl = `${cleanBase}/scan/${scanId}`;
  const badgeSrc = `${cleanBase}/api/badge/${scanId}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const badgeCode = useMemo(
    () =>
      `<a href="${shareUrl}" target="_blank" rel="noopener"><img src="${badgeSrc}" alt="A11ySverige tillgänglighetspoäng: ${score}/100" width="220" height="80" /></a>`,
    [shareUrl, badgeSrc, score],
  );

  const [copied, setCopied] = useState(false);
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(badgeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — clipboard may be blocked
    }
  }

  return (
    <div className="mt-12 grid md:grid-cols-2 gap-6">
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-paper border border-line rounded p-6 hover:bg-cream-2/60 transition"
      >
        <div className="text-xs uppercase tracking-[0.15em] text-ink-mute font-mono mb-2">
          — Dela resultatet
        </div>
        <h3 className="font-display text-2xl font-medium mb-2">
          Dela på LinkedIn
        </h3>
        <p className="text-sm text-ink-soft">
          När du delar länken visas en automatiskt genererad förhandsbild av
          poängen. Stänker du klistrar in den i ett mejl gäller samma sak.
        </p>
        <span className="mt-4 inline-block text-sm uppercase tracking-[0.1em] font-mono font-semibold text-terracotta">
          Öppna LinkedIn →
        </span>
      </a>

      <div className="bg-paper border border-line rounded p-6">
        <div className="text-xs uppercase tracking-[0.15em] text-ink-mute font-mono mb-2">
          — Inbäddningsbart märke
        </div>
        <h3 className="font-display text-2xl font-medium mb-3">
          Visa poängen på din sajt
        </h3>
        <div className="flex items-center gap-4 mb-3">
          <img
            src={badgeSrc}
            alt={`A11ySverige tillgänglighetspoäng: ${score}/100`}
            width={220}
            height={80}
            className="rounded"
          />
        </div>
        <p className="text-sm text-ink-soft mb-3">
          Kopiera kodsnutten och klistra in den var som helst på din webbplats.
          Bilden uppdateras automatiskt när du skannar om sidan.
        </p>
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onCopy}
            className="shrink-0 px-4 py-2 bg-ink text-cream text-xs uppercase tracking-[0.1em] font-semibold rounded hover:bg-terracotta transition"
          >
            {copied ? "Kopierat!" : "Kopiera kod"}
          </button>
          <pre className="flex-1 overflow-x-auto text-[10px] font-mono text-ink-soft bg-cream/60 border border-line rounded px-3 py-2 whitespace-pre-wrap break-all">
            {badgeCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
