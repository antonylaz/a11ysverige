"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Device = "desktop" | "mobile";

export function CompareForm() {
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [device, setDevice] = useState<Device>("desktop");
  const [status, setStatus] = useState<
    "idle" | "scanning-a" | "scanning-b" | "done"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function normalize(u: string): string {
    const t = u.trim();
    if (!t) return t;
    return t.startsWith("http://") || t.startsWith("https://") ? t : `https://${t}`;
  }

  async function scan(url: string): Promise<string> {
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, device }),
    });
    const data = await res.json().catch(() => ({ error: "Något gick fel." }));
    if (!res.ok) throw new Error(data.error ?? "Skanningen misslyckades.");
    return data.id as string;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      setStatus("scanning-a");
      const idA = await scan(normalize(urlA));
      setStatus("scanning-b");
      const idB = await scan(normalize(urlB));
      setStatus("done");
      router.push(`/jamfor/${idA}/${idB}`);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Något gick fel.");
    }
  }

  const busy = status !== "idle" && status !== "done";

  return (
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
      <div className="space-y-3">
        <input
          type="text"
          inputMode="url"
          value={urlA}
          onChange={(e) => setUrlA(e.target.value)}
          placeholder="https://din-sajt.se"
          required
          disabled={busy}
          aria-label="Första webbplatsen att jämföra"
          className="w-full px-5 py-4 bg-paper border border-line rounded text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 disabled:opacity-60"
        />
        <div className="flex items-center justify-center text-xs uppercase tracking-[0.2em] text-ink-mute font-mono py-1">
          mot
        </div>
        <input
          type="text"
          inputMode="url"
          value={urlB}
          onChange={(e) => setUrlB(e.target.value)}
          placeholder="https://konkurrent.se"
          required
          disabled={busy}
          aria-label="Andra webbplatsen att jämföra"
          className="w-full px-5 py-4 bg-paper border border-line rounded text-base focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 disabled:opacity-60"
        />
      </div>

      <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
        <fieldset
          className="inline-flex bg-paper border border-line rounded p-1"
          disabled={busy}
        >
          <legend className="sr-only">Skanna båda som</legend>
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
        <button
          type="submit"
          disabled={busy || urlA.length < 3 || urlB.length < 3}
          className="px-8 py-4 bg-terracotta text-cream font-semibold text-sm uppercase tracking-[0.1em] rounded hover:bg-ink transition disabled:bg-ink-mute disabled:cursor-not-allowed"
        >
          {busy ? "Skannar..." : "Jämför"}
        </button>
      </div>

      {busy && (
        <p
          className="mt-4 text-sm text-ink-soft text-center"
          aria-live="polite"
        >
          {status === "scanning-a"
            ? "Skannar första webbplatsen..."
            : "Skannar andra webbplatsen..."}{" "}
          (Skannas en i taget för att skona Renders gratis-instans.)
        </p>
      )}
      {error && (
        <p className="mt-4 text-sm text-red-warn text-center" role="alert">
          {error}
        </p>
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
        checked ? "bg-ink text-cream" : "text-ink-soft hover:text-ink"
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
