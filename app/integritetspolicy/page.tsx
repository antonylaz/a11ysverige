export default function Integritetspolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <a href="/" className="inline-block py-3 -my-3 text-sm text-ink-soft hover:text-terracotta">
        ← Tillbaka
      </a>
      <h1 className="font-display text-5xl font-medium tracking-tightest mt-8 mb-8">
        Integritetspolicy
      </h1>
      <div className="prose prose-lg text-ink-soft leading-relaxed space-y-4">
        <p>
          A11ySverige hanterar personuppgifter enligt GDPR. Vi sparar endast
          den information du själv lämnar (e-postadress vid PDF-nedladdning)
          och webbplatsadresser du skannar.
        </p>
        <p>
          <strong>Vi lagrar inte:</strong> innehållet på de webbplatser du
          skannar, dina cookies, eller någon annan information utan ditt
          uttryckliga samtycke.
        </p>
        <p>
          <strong>Du har rätt att:</strong> få ut alla uppgifter vi har om
          dig, få dem raderade, och invända mot behandling. Kontakta oss via
          kontaktsidan.
        </p>
        <p className="italic text-ink-mute">
          (Denna text är ett utkast — uppdateras med riktig juridisk text
          före publik lansering.)
        </p>
      </div>
    </main>
  );
}
