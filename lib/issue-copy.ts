/**
 * Swedish layperson explanations for the most common axe-core rule IDs.
 * Covers ~90 % of real-world WCAG 2.1 AA findings.
 *
 * When a rule isn't in the map, the UI falls back to axe's English
 * description with a small note.
 */

export interface IssueCopy {
  /** Short Swedish title that replaces axe's `help` field. */
  title: string;
  /** Plain-language explanation of what the issue is. */
  plain: string;
  /** Who this hurts and why it matters. */
  why: string;
  /** Concrete starting point for a developer fix. */
  fix: string;
}

export const ISSUE_COPY: Record<string, IssueCopy> = {
  "color-contrast": {
    title: "Otillräcklig kontrast mellan text och bakgrund",
    plain:
      "Texten skiljer sig inte tillräckligt mycket från sin bakgrund. WCAG kräver minst 4.5:1 för vanlig text och 3:1 för stor text.",
    why: "Användare med nedsatt syn, äldre användare och personer i starkt solljus kan inte läsa lågkontrasttext.",
    fix: "Mörka upp texten eller ljusa upp bakgrunden tills kontrastvärdet når 4.5:1. Verktyg: webaim.org/resources/contrastchecker.",
  },
  "image-alt": {
    title: "Bild saknar alt-text",
    plain:
      "En `<img>` har ingen alt-attribut, vilket gör att skärmläsare inte kan beskriva bilden.",
    why: "Blinda och synskadade användare får ingen information om vad bilden visar. Sökmotorer kan inte heller indexera innehållet.",
    fix: "Lägg till `alt=\"beskrivning\"` på meningsfulla bilder. För rent dekorativa bilder, använd `alt=\"\"` (tom) så att skärmläsaren hoppar över den.",
  },
  "svg-img-alt": {
    title: "SVG-bild saknar tillgängligt namn",
    plain:
      "En SVG med `role=\"img\"` saknar ett tillgängligt namn (t.ex. `<title>` eller `aria-label`).",
    why: "Skärmläsare hoppar över SVG:n eller läser upp filnamnet i stället för innehållet.",
    fix: "Lägg till ett `<title>`-element inuti SVG:n eller `aria-label` på själva `<svg>`-taggen.",
  },
  "object-alt": {
    title: "`<object>`-element saknar alternativ text",
    plain:
      "Inbäddat innehåll i ett `<object>`-element har ingen beskrivande text.",
    why: "Om innehållet inte kan visas (gammal plugin, blockerat innehåll) har användaren ingen aning om vad som saknas.",
    fix: "Lägg in fallback-text mellan `<object>...</object>` eller använd `aria-label`.",
  },
  "role-img-alt": {
    title: "Element med `role=\"img\"` saknar namn",
    plain:
      "Ett element som beter sig som en bild via `role=\"img\"` har inget tillgängligt namn.",
    why: "Skärmläsare läser inte upp någonting för bilden.",
    fix: "Lägg till `aria-label` eller `aria-labelledby` på elementet.",
  },
  "link-name": {
    title: "Länk saknar tillgängligt namn",
    plain:
      "En `<a>` saknar synlig text och har varken `aria-label` eller alt-text på en innesluten bild.",
    why: "Skärmläsare läser upp länken som \"länk\" utan att säga vart den leder.",
    fix: "Lägg till synlig text inuti länken, eller `aria-label=\"...\"`. Bildlänkar måste ha alt-text på bilden.",
  },
  "button-name": {
    title: "Knapp saknar tillgängligt namn",
    plain:
      "En `<button>` har varken synlig text, `aria-label` eller `aria-labelledby`.",
    why: "Användare med skärmläsare hör ingenting förutom \"knapp\" och förstår inte vad den gör.",
    fix: "Lägg till text inuti knappen, eller `aria-label` om den bara har en ikon.",
  },
  "input-button-name": {
    title: "Knapp-input saknar värde",
    plain:
      "En `<input type=\"button|submit|reset\">` saknar `value`-attribut.",
    why: "Skärmläsare har inget att läsa upp och användaren vet inte vad knappen gör.",
    fix: "Lägg till `value=\"Skicka\"` (eller liknande) eller använd `aria-label`.",
  },
  "label": {
    title: "Formulärfält saknar etikett",
    plain:
      "Ett `<input>`, `<select>` eller `<textarea>` saknar tydlig koppling till en etikett.",
    why: "Skärmläsare läser inte upp vad fältet är till för. Användare med kognitiv funktionsnedsättning kan ha svårt att fylla i rätt sak.",
    fix: "Koppla ett `<label for=\"id\">` till fältets `id`, eller använd `aria-label` / `aria-labelledby`.",
  },
  "form-field-multiple-labels": {
    title: "Formulärfält har flera etiketter",
    plain:
      "Samma fält har två eller fler `<label>`-element kopplade till sig.",
    why: "Skärmläsare läser bara upp en av dem, vanligen den första — vilket kan vara fel.",
    fix: "Ha exakt en `<label>` per fält. Slå ihop texten om båda är viktiga.",
  },
  "select-name": {
    title: "`<select>` saknar tillgängligt namn",
    plain:
      "En rullgardinsmeny har varken `<label>`, `aria-label` eller `aria-labelledby`.",
    why: "Användare hör bara \"rullgardin\" utan att veta vad de väljer.",
    fix: "Lägg till `<label for=\"...\">` eller `aria-label` på `<select>`.",
  },
  "autocomplete-valid": {
    title: "Ogiltigt `autocomplete`-värde",
    plain:
      "Ett `autocomplete`-attribut har ett värde som inte finns i HTML-specifikationen.",
    why: "Webbläsaren och hjälpmedel kan inte fylla i fältet automatiskt, vilket gör det svårare för användare med motoriska svårigheter.",
    fix: "Använd ett standardvärde — t.ex. `email`, `name`, `tel`. Lista: html.spec.whatwg.org/#autofill.",
  },
  "document-title": {
    title: "Dokumentet saknar `<title>`",
    plain:
      "`<head>` har inget `<title>`-element, eller titeln är tom.",
    why: "Skärmläsare läser upp titeln när sidan laddas. Utan titel vet användaren inte vilken sida den är på.",
    fix: "Lägg till `<title>Tydlig sidtitel</title>` i `<head>`.",
  },
  "html-has-lang": {
    title: "`<html>` saknar `lang`-attribut",
    plain:
      "Rotelementet `<html>` saknar `lang`-attributet.",
    why: "Skärmläsare vet inte vilket språk de ska läsa upp sidan på — svensk text läses upp med engelsk uttal.",
    fix: "Lägg till `lang=\"sv\"` på `<html>`-taggen.",
  },
  "html-lang-valid": {
    title: "`<html>` har ogiltigt `lang`-värde",
    plain:
      "`lang`-attributet finns men värdet är inte en giltig språkkod.",
    why: "Skärmläsare faller tillbaka till standardspråket och uttalar texten fel.",
    fix: "Använd en BCP-47-kod, t.ex. `sv`, `sv-SE`, `en-US`.",
  },
  "valid-lang": {
    title: "Felaktig språkkod i `lang`",
    plain:
      "Ett `lang`-attribut inuti sidan har ett ogiltigt värde.",
    why: "Skärmläsaren byter inte uttal korrekt för stycket.",
    fix: "Använd en giltig BCP-47-kod, t.ex. `en` för engelska citat.",
  },
  "frame-title": {
    title: "`<iframe>` saknar `title`",
    plain:
      "En inbäddad ram saknar `title`-attribut.",
    why: "Skärmläsare läser upp \"ram\" utan att säga vad den innehåller.",
    fix: "Lägg till `title=\"Beskrivning av innehållet\"` på `<iframe>`.",
  },
  "landmark-one-main": {
    title: "Sidan saknar `<main>`-landmark",
    plain:
      "Det finns inget `<main>`-element eller `role=\"main\"` på sidan.",
    why: "Skärmläsare använder landmarks för att hoppa förbi navigation och menyer. Utan `<main>` måste användaren navigera igenom allt.",
    fix: "Linda huvudinnehållet i `<main>...</main>`. Det ska finnas exakt ett per sida.",
  },
  "region": {
    title: "Innehåll utanför landmark-områden",
    plain:
      "Visst innehåll på sidan ligger utanför `<main>`, `<nav>`, `<header>`, `<footer>` osv.",
    why: "Användare som navigerar via landmarks missar innehållet helt.",
    fix: "Linda allt innehåll i ett meningsfullt landmark-element.",
  },
  "page-has-heading-one": {
    title: "Sidan saknar `<h1>`",
    plain:
      "Det finns ingen huvudrubrik på sidan.",
    why: "Skärmläsare använder `<h1>` för att presentera sidans ämne. Utan den vet användaren inte vad sidan handlar om.",
    fix: "Lägg till exakt en `<h1>` som beskriver vad sidan är, helst som första synliga rubrik.",
  },
  "heading-order": {
    title: "Rubrikordningen hoppar nivåer",
    plain:
      "Rubriker går från t.ex. `<h2>` direkt till `<h4>` utan ett mellanliggande `<h3>`.",
    why: "Skärmläsare användare navigerar via rubriknivåer. Hopp i ordning gör strukturen förvirrande.",
    fix: "Justera rubriknivåerna så att de följer en logisk ordning utan att hoppa.",
  },
  "bypass": {
    title: "Saknar mekanism för att hoppa över återkommande innehåll",
    plain:
      "Sidan har ingen \"skip-link\" eller motsvarande landmark som låter användare hoppa förbi menyn.",
    why: "Användare som navigerar med tangentbord tvingas tabba igenom hela menyn på varje sida.",
    fix: "Lägg till en synlig-vid-fokus skip-link först i `<body>`: `<a href=\"#main\">Hoppa till huvudinnehåll</a>`.",
  },
  "duplicate-id": {
    title: "Två eller fler element har samma `id`",
    plain:
      "Sidan har duplicerade `id`-värden, vilket strider mot HTML-specifikationen.",
    why: "Etikett-fält-kopplingar (`for=\"id\"`) blir tvetydiga. Skärmläsare och annan teknik kan referera till fel element.",
    fix: "Säkerställ att varje `id` är unik. Ta bort dubbletter eller byt till klasser där möjligt.",
  },
  "duplicate-id-aria": {
    title: "Duplicerade `id`:n som refereras av ARIA",
    plain:
      "Ett `aria-labelledby` eller `aria-describedby` pekar på ett `id` som finns flera gånger.",
    why: "Skärmläsaren plockar fel element, eller ingen alls — användaren får felaktig information.",
    fix: "Gör varje `id` unik. Om flera element ska beskrivas tillsammans, peka på dem med mellanslag: `aria-labelledby=\"a b c\"`.",
  },
  "duplicate-id-active": {
    title: "Två interaktiva element har samma `id`",
    plain:
      "Två fält, knappar eller länkar har samma `id`.",
    why: "Tangentbordsnavigation och fokushantering blir oförutsägbara.",
    fix: "Säkerställ unika `id`:n för alla interaktiva element.",
  },
  "aria-allowed-attr": {
    title: "ARIA-attribut inte tillåtet på elementet",
    plain:
      "Ett `aria-*`-attribut används på ett element där det inte är giltigt enligt ARIA-specifikationen.",
    why: "Skärmläsare ignorerar det eller, värre, presenterar elementet felaktigt.",
    fix: "Ta bort det otillåtna attributet, eller byt till ett element/roll som stöder det.",
  },
  "aria-required-attr": {
    title: "ARIA-roll saknar obligatoriskt attribut",
    plain:
      "Ett element med en ARIA-roll saknar attribut som rollen kräver (t.ex. `role=\"checkbox\"` utan `aria-checked`).",
    why: "Hjälpmedel kan inte presentera elementets tillstånd korrekt.",
    fix: "Lägg till de attribut rollen kräver. Lista: w3.org/TR/wai-aria.",
  },
  "aria-valid-attr": {
    title: "Okänt ARIA-attribut",
    plain:
      "Ett attribut börjar med `aria-` men är inte ett giltigt ARIA-attribut.",
    why: "Förmodligen ett stavfel — hjälpmedel ignorerar det helt.",
    fix: "Kontrollera stavningen. Vanliga fel: `aria-labeledby` (saknat \"l\") istället för `aria-labelledby`.",
  },
  "aria-valid-attr-value": {
    title: "Ogiltigt värde på ARIA-attribut",
    plain:
      "Ett ARIA-attribut har ett värde som inte är tillåtet (t.ex. `aria-hidden=\"yes\"` istället för `\"true\"`).",
    why: "Hjälpmedel kan tolka attributet fel eller ignorera det.",
    fix: "Använd ett giltigt värde — vanligen `true` / `false`, eller ett `id` för referenser.",
  },
  "aria-hidden-focus": {
    title: "Fokuserbart element är `aria-hidden`",
    plain:
      "Ett element är dolt för skärmläsare med `aria-hidden=\"true\"` men kan fortfarande nås med tangentbord.",
    why: "Användaren tabbar in på ett element som skärmläsaren tystar — förvirrande och otillgängligt.",
    fix: "Antingen ta bort `aria-hidden`, eller lägg till `tabindex=\"-1\"` så att elementet inte kan fokuseras.",
  },
  "aria-hidden-body": {
    title: "`<body>` är `aria-hidden`",
    plain:
      "Hela `<body>` är gömd för skärmläsare.",
    why: "Skärmläsare läser ingenting på sidan.",
    fix: "Ta bort `aria-hidden=\"true\"` från `<body>`.",
  },
  "list": {
    title: "Listmarkering används utan listobjekt",
    plain:
      "Ett `<ul>` eller `<ol>` innehåller andra element än `<li>`.",
    why: "Skärmläsare räknar inte listan korrekt, så användaren får inte veta hur många objekt det finns.",
    fix: "Flytta in övriga element inuti `<li>`-element, eller använd en annan strukturell wrapper.",
  },
  "listitem": {
    title: "`<li>` saknar en `<ul>` / `<ol>`-förälder",
    plain:
      "Ett `<li>` ligger direkt under något annat än `<ul>`, `<ol>` eller `<menu>`.",
    why: "Skärmläsare behandlar det inte som en del av en lista.",
    fix: "Linda `<li>`-elementen i en korrekt listförälder.",
  },
  "definition-list": {
    title: "Felaktig struktur i `<dl>`",
    plain:
      "Definitionslistan innehåller element som inte är `<dt>` eller `<dd>`.",
    why: "Skärmläsaren förstår inte relationen mellan termer och definitioner.",
    fix: "Säkerställ att `<dl>` endast innehåller `<dt>` följt av en eller flera `<dd>`.",
  },
  "dlitem": {
    title: "`<dt>` eller `<dd>` utanför `<dl>`",
    plain:
      "Ett definitionslisteobjekt ligger utanför sin förälder `<dl>`.",
    why: "Strukturen blir trasig och skärmläsare presenterar fel.",
    fix: "Linda objektet i `<dl>`.",
  },
  "tabindex": {
    title: "`tabindex` större än 0",
    plain:
      "Ett element har `tabindex=\"1\"` eller högre, vilket ändrar tangentbordsordningen.",
    why: "Användarens fokusordning blir oförutsägbar och avviker från visuell ordning.",
    fix: "Använd `tabindex=\"0\"` (för att lägga till element i naturlig ordning) eller `\"-1\"` (för att ta bort), aldrig positiva värden.",
  },
  "meta-viewport": {
    title: "Zoom är inaktiverat i `<meta name=\"viewport\">`",
    plain:
      "Viewport-metan har `user-scalable=no` eller `maximum-scale=1`.",
    why: "Användare med nedsatt syn kan inte zooma in för att läsa.",
    fix: "Ta bort `user-scalable=no` och `maximum-scale` ur `<meta name=\"viewport\">`.",
  },
  "nested-interactive": {
    title: "Interaktiva element är nästlade",
    plain:
      "En knapp inuti en länk, en länk inuti en knapp, eller liknande.",
    why: "Tangentbordsanvändare och skärmläsare hanterar fokus och aktivering oförutsägbart.",
    fix: "Strukturera om så att interaktiva element ligger sida vid sida i stället för i varandra.",
  },
  "scrollable-region-focusable": {
    title: "Scrollbar region går inte att nå med tangentbord",
    plain:
      "En region som scrollar visuellt kan inte fokuseras med tangentbord.",
    why: "Användare utan mus kan inte scrolla innehållet.",
    fix: "Lägg till `tabindex=\"0\"` på den scrollbara behållaren.",
  },
  "td-headers-attr": {
    title: "`<td>` refererar till felaktiga rubriker",
    plain:
      "`headers`-attributet på en cell pekar på ett `id` som inte existerar eller inte är en `<th>`.",
    why: "Skärmläsare läser inte upp rätt rubrik för cellen, så användaren tappar bort sig i tabellen.",
    fix: "Säkerställ att varje `id` i `headers` matchar en faktisk `<th>` i samma tabell.",
  },
  "th-has-data-cells": {
    title: "Tabellrubrik saknar tillhörande celler",
    plain:
      "En `<th>` har inga datarader som refererar till sig.",
    why: "Rubriken bidrar inte till någon information för skärmläsaranvändare.",
    fix: "Antingen ta bort rubriken eller säkerställ att celler refererar till den via `headers` eller `scope`.",
  },
  "empty-heading": {
    title: "Tom rubrik",
    plain:
      "En `<h1>`–`<h6>` är tom eller innehåller bara mellanslag.",
    why: "Skärmläsaren läser upp \"rubrik\" utan innehåll, vilket är förvirrande.",
    fix: "Ta bort tomma rubriker eller fyll på med beskrivande text.",
  },
  "empty-table-header": {
    title: "Tabellrubrik är tom",
    plain:
      "En `<th>` saknar text.",
    why: "Skärmläsare kan inte beskriva kolumnen eller raden för användaren.",
    fix: "Lägg till beskrivande text i `<th>`.",
  },
  "skip-link": {
    title: "Skip-länken pekar inte på sidans innehåll",
    plain:
      "En \"hoppa till\"-länk har ett mål som inte finns eller inte fokuseras.",
    why: "Tangentbordsanvändare hoppar till ingenstans och måste tabba igenom hela menyn ändå.",
    fix: "Säkerställ att skip-länkens `href=\"#id\"` matchar ett `id` på huvudinnehållet.",
  },
  "aria-required-children": {
    title: "ARIA-roll saknar nödvändiga barnelement",
    plain:
      "Ett element har en roll (t.ex. `role=\"list\"`, `role=\"menu\"`) men innehåller inte de barn som ARIA-specifikationen kräver.",
    why: "Skärmläsare kan inte presentera den semantiska strukturen, så användaren tappar bort sig i komponenten.",
    fix: "Lägg till de nödvändiga barnen — t.ex. `role=\"list\"` kräver `role=\"listitem\"`-barn — eller ta bort förälderns roll.",
  },
  "aria-required-parent": {
    title: "ARIA-element saknar nödvändig förälder",
    plain:
      "Ett element med en roll (t.ex. `role=\"listitem\"`) ligger utanför sin obligatoriska förälder.",
    why: "Hjälpmedel behandlar inte elementet som en del av strukturen.",
    fix: "Lägg in elementet i en korrekt förälder, eller justera roll-användningen.",
  },
  "aria-roles": {
    title: "Ogiltig ARIA-roll",
    plain:
      "Ett `role`-attribut har ett värde som inte finns i ARIA-specifikationen.",
    why: "Roll ignoreras och elementet beter sig inte som du tror.",
    fix: "Kontrollera stavning, eller byt till en standardiserad roll. Lista: w3.org/TR/wai-aria.",
  },
  "aria-toggle-field-name": {
    title: "ARIA-växel saknar namn",
    plain:
      "Ett element med `role=\"switch\"`, `role=\"checkbox\"` eller `role=\"radio\"` har inget tillgängligt namn.",
    why: "Användaren hör bara \"växel\" eller \"kryssruta\" utan att veta vad den styr.",
    fix: "Lägg till `aria-label` eller koppla en `<label>` via `aria-labelledby`.",
  },
  "aria-tooltip-name": {
    title: "ARIA-verktygstips saknar namn",
    plain:
      "Ett element med `role=\"tooltip\"` har ingen tillgänglig text.",
    why: "Skärmläsaren har inget att läsa upp när verktygstipset visas.",
    fix: "Lägg till text inuti elementet eller `aria-label`.",
  },
  "aria-progressbar-name": {
    title: "Förloppsindikator saknar namn",
    plain:
      "Ett `role=\"progressbar\"` saknar tillgängligt namn.",
    why: "Användaren hör värdet men vet inte vad det mäter.",
    fix: "Lägg till `aria-label=\"Laddar...\"` eller liknande på elementet.",
  },
  "presentation-role-conflict": {
    title: "`role=\"presentation\"` används på interaktivt element",
    plain:
      "Ett element har explicit fått rollen \"presentation\" men har också inneboende semantik som inte kan tas bort (t.ex. en länk).",
    why: "Skärmläsare behandlar elementet inkonsekvent — semantiken \"läcker\" igenom.",
    fix: "Ta bort `role=\"presentation\"` från länkar, knappar och formulärfält.",
  },
  "color-contrast-enhanced": {
    title: "Otillräcklig förstärkt kontrast (AAA)",
    plain:
      "Text klarar AA-nivån men inte AAA-nivån (7:1 för vanlig text, 4.5:1 för stor text).",
    why: "AAA-nivån behövs för användare med kraftigt nedsatt syn. Inte ett lagkrav, men en stark rekommendation.",
    fix: "Öka kontrasten ytterligare. Detta är en frivillig nivå — prioritera AA-fel först.",
  },
  "scope-attr-valid": {
    title: "Felaktigt `scope`-värde i tabell",
    plain:
      "En `<th>` har ett `scope`-attribut med ett värde som inte är `row`, `col`, `rowgroup` eller `colgroup`.",
    why: "Skärmläsare kopplar inte rubriker till rätt celler.",
    fix: "Använd `scope=\"row\"` eller `scope=\"col\"` på `<th>`-element.",
  },
  "table-fake-caption": {
    title: "Tabell saknar `<caption>`",
    plain:
      "En tabell har en text ovanför sig som ser ut som en rubrik, men är inte ett `<caption>`-element.",
    why: "Skärmläsare meddelar inte tabellens syfte när användaren navigerar in i den.",
    fix: "Använd `<caption>...</caption>` som första barn i `<table>`.",
  },
  "td-has-header": {
    title: "Tabellcell saknar tillhörande rubrik",
    plain:
      "En cell i en datatabell har ingen `<th>` som beskriver vad den innehåller.",
    why: "Skärmläsare läser bara upp värdet utan kontext.",
    fix: "Säkerställ att varje datatabell har rader/kolumner med `<th>`-rubriker.",
  },
  "no-autoplay-audio": {
    title: "Ljud spelas automatiskt i mer än 3 sekunder",
    plain:
      "Ett `<audio>` eller `<video>` med ljud spelas automatiskt utan att användaren kan stoppa det inom 3 sekunder.",
    why: "Skärmläsaranvändare hör två ljudkällor samtidigt — sin egen skärmläsare och din autoplay.",
    fix: "Lägg till tydlig paus-/stopp-kontroll, kortare ljud, eller `muted`-attribut som standard.",
  },
};

export function getIssueCopy(ruleId: string): IssueCopy | null {
  return ISSUE_COPY[ruleId] ?? null;
}

export const ISSUE_COPY_COVERED_COUNT = Object.keys(ISSUE_COPY).length;
