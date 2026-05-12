export default function Kontakt() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <a href="/" className="inline-block py-3 -my-3 text-sm text-ink-soft hover:text-terracotta">
        ← Tillbaka
      </a>
      <h1 className="font-display text-5xl font-medium tracking-tightest mt-8 mb-8">
        Kontakt
      </h1>
      <p className="text-lg text-ink-soft leading-relaxed mb-4">
        A11ySverige byggs i Stockholm av Antonio.
      </p>
      <p className="text-lg text-ink-soft leading-relaxed">
        Hör av dig på{" "}
        <a className="text-terracotta hover:text-ink underline" href="mailto:hej@a11ysverige.se">
          hej@a11ysverige.se
        </a>{" "}
        — frågor, samarbeten, eller om du vill testa verktyget tidigt.
      </p>
    </main>
  );
}
