"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "./Spinner";

type Device = "desktop" | "mobile";

export function ScanForm() {
  const [url, setUrl] = useState("");
  const [device, setDevice] = useState<Device>("desktop");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let normalized = url.trim();
      if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
        normalized = "https://" + normalized;
      }

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized, device }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Något gick fel." }));
        throw new Error(data.error ?? "Skanningen misslyckades.");
      }

      const { id } = await res.json();
      router.push(`/scan/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://dinwebbplats.se"
          required
          disabled={loading}
          aria-label="URL till webbplatsen som ska skannas"
          className="flex-grow px-5 py-4 bg-paper border border-line rounded text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || url.length < 3}
          className="px-8 py-4 bg-terracotta text-cream font-semibold text-sm uppercase tracking-[0.1em] rounded hover:bg-ink transition disabled:bg-ink-mute disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {loading && <Spinner size={14} />}
          {loading ? "Skannar..." : "Skanna gratis"}
        </button>
      </div>

      {/* Device toggle */}
      <fieldset
        className="mt-4 inline-flex bg-paper border border-line rounded p-1"
        disabled={loading}
        aria-label="Välj enhet att simulera"
      >
        <legend className="sr-only">Skanna som</legend>
        <DeviceOption
          checked={device === "desktop"}
          onChange={() => setDevice("desktop")}
          label="Dator"
          subLabel="1366 × 900"
        />
        <DeviceOption
          checked={device === "mobile"}
          onChange={() => setDevice("mobile")}
          label="Mobil"
          subLabel="iPhone · 390 × 844"
        />
      </fieldset>

      {error && (
        <p className="mt-3 text-sm text-red-warn" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <div
          className="mt-5 mx-auto max-w-xl bg-paper border border-line rounded p-4 flex items-start gap-3"
          aria-live="polite"
        >
          <Spinner size={20} className="text-terracotta shrink-0 mt-0.5" />
          <div className="text-left text-sm">
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink mb-0.5">
              Skannar
            </div>
            <p className="text-ink-soft">
              {device === "mobile"
                ? "Renderar sidan i mobilvy och kör WCAG-tester. Räkna med 30–60 sekunder."
                : "Renderar sidan och kör WCAG-tester. Räkna med 30–60 sekunder."}
            </p>
          </div>
        </div>
      )}
    </form>
  );
}

function DeviceOption({
  checked,
  onChange,
  label,
  subLabel,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  subLabel: string;
}) {
  return (
    <label
      className={`cursor-pointer px-4 py-2 rounded transition select-none ${
        checked
          ? "bg-ink text-cream"
          : "text-ink-soft hover:text-ink"
      }`}
    >
      <input
        type="radio"
        name="device"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="block text-xs uppercase tracking-[0.1em] font-semibold">
        {label}
      </span>
      <span
        className={`block text-[10px] font-mono mt-0.5 ${
          checked ? "text-cream/70" : "text-ink-mute"
        }`}
      >
        {subLabel}
      </span>
    </label>
  );
}
